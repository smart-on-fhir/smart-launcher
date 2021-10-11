const jwt        = require("jsonwebtoken");
const Url        = require("url");
const replaceAll = require("replaceall");
const config     = require("./config");

const RE_GT    = />/g;
const RE_LT    = /</g;
const RE_AMP   = /&/g;
const RE_QUOT  = /"/g;
const RE_FALSE = /^(0|no|false|off|null|undefined|NaN|)$/i;
const RE_RESOURCE_SLASH_ID = new RegExp(
    "([A-Z][A-Za-z]+)"    + // resource type
    "(\\/([^_][^\\/?]+))" + // resource id
    "(\\/?(\\?(.*))?)?"     // suffix (query)
);

function htmlEncode(html) {
    return String(html)
        .trim()
        .replace(RE_AMP , "&amp;")
        .replace(RE_LT  , "&lt;")
        .replace(RE_GT  , "&gt;")
        .replace(RE_QUOT, "&quot;");
}

/**
 * Walks thru an object (ar array) and returns the value found at the
 * provided path. This function is very simple so it intentionally does not
 * support any argument polymorphism, meaning that the path can only be a
 * dot-separated string. If the path is invalid returns undefined.
 * @param {Object} obj The object (or Array) to walk through
 * @param {String} path The path (eg. "a.b.4.c")
 * @returns {*} Whatever is found in the path or undefined
 */
function getPath(obj, path = "") {
    return path.split(".").reduce((out, key) => out ? out[key] : undefined, obj)
}

/**
 * Simplified version of printf. Just replaces all the occurrences of "%s" with
 * whatever is supplied in the rest of the arguments. If no argument is supplied
 * the "%s" token is left as is.
 * @param {String} s The string to format
 * @param {*} ... The rest of the arguments are used for the replacements
 * @return {String}
 */
function printf(s) {
    var args = arguments, l = args.length, i = 0;
    return String(s || "").replace(/(%s)/g, a => ++i > l ? "" : args[i]);
}

function die(error="Unknown error") {
    console.log("\n"); // in case we have something written to stdout directly
    console.error(error);
    process.exit(1);
}

function generateRefreshToken(code) {
    let token = {};
    ["context", "client_id", "scope", "user", "iat"/*, "exp"*/, "auth_error"].forEach(key => {
        if (code.hasOwnProperty(key)) {
            token[key] = code[key];
        }
    });
    return jwt.sign(token, config.jwtSecret, {
        expiresIn: config.refreshTokenLifeTime * 60
    });
}

function redirectWithError(req, res, name, ...rest) {
    let redirectURL = Url.parse(req.query.redirect_uri, true);
    redirectURL.query.error = name;
    redirectURL.query.error_description = getErrorText(name, ...rest);
    if (req.query.state) {
        redirectURL.query.state = req.query.state;
    }
    return res.redirect(Url.format(redirectURL));
}

function replyWithError(res, name, code = 500, ...params) {
    return res.status(code).send(getErrorText(name, ...params));
}

function getErrorText(name, ...rest) {
    return printf(config.errors[name], ...rest);
}

function getFirstMissingProperty(object, properties) {
    return (Array.isArray(properties) ? properties : [properties]).find(
        param => !object[param]
    );
}

function bool(x) {
    return !RE_FALSE.test(String(x).trim());
}

function parseToken(token) {
    if (typeof token != "string") {
        throw new Error("The token must be a string");
    }

    token = token.split(".");

    if (token.length != 3) {
        throw new Error("Invalid token structure");
    }

    return JSON.parse(new Buffer(token[1], "base64").toString("utf8"));
}

// require a valid auth token if there is an auth token
function checkAuth(req, res, next) {
    if (req.headers.authorization) {
        try {
            token = jwt.verify(
                req.headers.authorization.split(" ")[1],
                config.jwtSecret
            );
        } catch (e) {
            return res.status(401).send(
                `${e.name || "Error"}: ${e.message || "Invalid token"}`
            );
        }
        if (token.sim_error) {
            return res.status(401).send(token.sim_error);
        }
    }
    next();
}

function operationOutcome(res, message, {
    httpCode  = 500,
    issueCode = "processing", // http://hl7.org/fhir/valueset-issue-type.html
    severity  = "error"       // fatal | error | warning | information
} = {}){
    return res.status(httpCode).json({
        "resourceType": "OperationOutcome",
        "text": {
            "status": "generated",
            "div": `<div xmlns="http://www.w3.org/1999/xhtml">
    <h1>Operation Outcome</h1>
    <table border="0">
        <tr>
            <td style="font-weight:bold;">ERROR</td>
            <td>[]</td>
            <td><pre>${htmlEncode(message)}</pre></td>
        </tr>
    </table>
</div>`
        },
        "issue": [
            {
                "severity"   : severity,
                "code"       : issueCode,
                "diagnostics": message
            }
        ]
    });
}

/**
 * Given a request object, returns its base URL
 */
function getRequestBaseURL(req) {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
    return protocol + "://" + host;
}

// Sandbox-ify -----------------------------------------------------------------

function buildUrlPath(...segments) {
    return segments.map(
        s => String(s)
            .replace(/^\//, "")
            .replace(/\/$/, "")
    ).join("\/");
}

function normalizeUrl(url) {
    return buildUrlPath(url).toLowerCase();
}

/**
 * Given a conformance statement (as JSON string), replaces the auth URIs with
 * new ones that point to our proxy server. Also add the rest.security.service
 * field.
 * @param {String} bodyText    A conformance statement as JSON string
 * @param {String} authBaseUrl The baseUrl of our server
 * @returns {Object|null} Returns the modified JSON object or null in case of error
 */
function augmentConformance(bodyText, authBaseUrl) {
    let json;
    try {
        json = JSON.parse(bodyText);
        if (!json.rest[0].security){
            json.rest[0].security = {};
        }
    } catch (e) {
        console.error(e);
        return null;
    }

    json.rest[0].security.extension = [{
        "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
        "extension": [
            {
                "url": "authorize",
                "valueUri": buildUrlPath(authBaseUrl, "/authorize")
            },
            {
                "url": "token",
                "valueUri": buildUrlPath(authBaseUrl, "/token")
            },
            {
                "url": "introspect",
                "valueUri": buildUrlPath(authBaseUrl, "/introspect")
            }
        ]
    }];

    json.rest[0].security.service = [
        {
          "coding": [
            {
              "system": "http://hl7.org/fhir/restful-security-service",
              "code": "SMART-on-FHIR",
              "display": "SMART-on-FHIR"
            }
          ],
          "text": "OAuth2 using SMART-on-FHIR profile (see http://docs.smarthealthit.org)"
        }
    ]

    return json;
}

function unBundleResource(bundle) {
    try {
        return JSON.parse(bundle).entry[0].resource;
    } catch (e) {
        return null;
    }
}

function adjustResponseUrls(bodyText, fhirUrl, requestUrl, fhirBaseUrl, requestBaseUrl) {
    bodyText = replaceAll(fhirUrl, requestUrl, bodyText);
    bodyText = replaceAll(fhirUrl.replace(",", "%2C"), requestUrl, bodyText); // allow non-encoded commas
    bodyText = replaceAll(fhirBaseUrl, requestBaseUrl, bodyText);
    return bodyText;
}

function adjustUrl(url, isGet, sandboxes = []) {
    
    url = url.replace(RE_RESOURCE_SLASH_ID, (
        resourceAndId,
        resource,
        slashAndId,
        id,
        suffix,
        slashAndQuery,
        query
    ) => resource + "?" + (query ? query + "&" : "") + "_id=" + id);

    // Also add tags if needed
    if (sandboxes.length) {
        // For GET requests add all the tags to act as filters.
        // Otherwise only keep the first (the custom) tag
        let sandboxTags = isGet ? sandboxes.join(",") : sandboxes[0];
        url += (url.indexOf("?") == -1 ? "?" : "&") + "_tag=" + sandboxTags;
    }

    return url;
}

function adjustRequestBody(json, system, sandboxes) {
    (json.entry || [{resource: json}]).forEach( entry => {
        if (entry.request) {
            entry.request.url = 
                adjustUrl(entry.request.url, entry.request.method.toUpperCase() == "GET", sandboxes);
        }

        let resource = entry.resource;
        if (!resource.meta) {
            resource.meta = {tag: [{system: system, code: sandboxes[0]}]};
        } else if (!resource.meta.tag) {
            resource.meta.tag =  [{system: system, code: sandboxes[0]}];
        } else {
            resource.meta.tag = resource.meta.tag.filter( t => t.system != system );
            resource.meta.tag.push({system: system, code: sandboxes[0]});
        }
    });
    return json;
}

module.exports = {
    getPath,
    generateRefreshToken,
    printf,
    redirectWithError,
    replyWithError,
    getErrorText,
    getFirstMissingProperty,
    htmlEncode,
    bool,
    parseToken,
    checkAuth,
    operationOutcome,
    buildUrlPath,
    augmentConformance,
    normalizeUrl,
    unBundleResource,
    adjustResponseUrls,
    adjustUrl,
    adjustRequestBody,
    getRequestBaseURL,
    die
};