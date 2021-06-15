const Url        = require("url");
const request    = require("request");
const jwt        = require("jsonwebtoken");
const replStream = require("replacestream");
const config     = require("./config");
const debug      = require('util').debuglog("proxy");
const Lib        = require("./lib");
const OperationOutcome = require("./OperationOutcome");
const replaceAll = require("replaceall");

////** @type {any} */
const assert = Lib.assert;

const RE_RESOURCE_SLASH_ID = new RegExp(
    "([A-Z][A-Za-z]+)"    + // resource type
    "(\\/([^_][^\\/?]+))" + // resource id
    "(\\/?(\\?(.*))?)?"     // suffix (query)
);


/**
 * Given a conformance statement (as JSON string), replaces the auth URIs with
 * new ones that point to our proxy server. Also add the rest.security.service
 * field.
 * @param {String} bodyText A conformance statement as JSON string
 * @param {String} baseUrl  The baseUrl of our server
 * @returns {Object|null} Returns the modified JSON object or null in case of error
 */
function augmentConformance(bodyText, baseUrl) {
    let json = JSON.parse(bodyText);

    json.rest[0].security.extension = [{
        "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
        "extension": [
            {
                "url": "authorize",
                "valueUri": Lib.buildUrlPath(baseUrl, "/auth/authorize")
            },
            {
                "url": "token",
                "valueUri": Lib.buildUrlPath(baseUrl, "/auth/token")
            },
            {
                "url": "introspect",
                "valueUri": Lib.buildUrlPath(baseUrl, "/auth/introspect")
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

function adjustResponseUrls(bodyText, fhirUrl, requestUrl, fhirBaseUrl, requestBaseUrl) {
    bodyText = replaceAll(fhirUrl, requestUrl, bodyText);
    bodyText = replaceAll(fhirUrl.replace(",", "%2C"), requestUrl, bodyText); // allow non-encoded commas
    bodyText = replaceAll("/fhir", requestBaseUrl, bodyText);
    return bodyText;
}

function adjustUrl(url) {
    return url.replace(RE_RESOURCE_SLASH_ID, (
        resourceAndId,
        resource,
        slashAndId,
        id,
        suffix,
        slashAndQuery,
        query
    ) => resource + "?" + (query ? query + "&" : "") + "_id=" + id);
}

function handleMetadataRequest(req, res, fhirServer)
{
    // set everything to JSON since we don't currently support XML and block XML
    // requests at a middleware layer
    let fhirRequest = {
        headers: {
            "content-type": "application/json",
            "accept"      : req.params.fhir_release.toUpperCase() == "R2" ? "application/json+fhir" : "application/fhir+json"
        },
        method: req.method,
        url: Lib.buildUrlPath(fhirServer, adjustUrl(req.url))
    }

    if (process.env.NODE_ENV != "test") {
        debug(fhirRequest.url, fhirRequest);
    }

    request(fhirRequest, function(error, response, body) {
        if (error) {
            return res.send(JSON.stringify(error, null, 4));
        }
        res.status(response.statusCode);
        response.headers['content-type'] && res.type(response.headers['content-type']);
     
        // adjust urls in the fhir response so future requests will hit the proxy
        if (body) {
            let requestUrl = Lib.buildUrlPath(config.baseUrl, req.originalUrl);
            let requestBaseUrl = Lib.buildUrlPath(config.baseUrl, req.baseUrl)
            body = adjustResponseUrls(body, fhirRequest.url, requestUrl, fhirServer, requestBaseUrl);
        }

        // special handler for metadata requests - inject the SMART information
        if (response.statusCode == 200 && body.indexOf("fhirVersion") != -1) {
            let baseUrl = Lib.buildUrlPath(config.baseUrl, req.baseUrl.replace("/fhir", ""));
            let secure = req.secure || req.headers["x-forwarded-proto"] == "https";
            baseUrl = baseUrl.replace(/^https?/, secure ? "https" : "http");
            body = augmentConformance(body, baseUrl);
            if (!body) {
                res.status(404);
                body = new OperationOutcome("Error reading server metadata")
            }
        }

        body = (typeof body == "string" ? body : JSON.stringify(body, null, 4));

        res.send(body);
    });
    
}

/**
 * @param {import("express").Request} req 
 */
function validateToken(req) {
    let token = null;

    // Validate token ---------------------------------------------------------
    if (req.headers.authorization) {

        // require a valid auth token if there is an auth token
        try {
            token = jwt.verify(
                req.headers.authorization.split(" ")[1],
                config.jwtSecret
            );
        } catch (e) {
            throw new Lib.HTTPError(401, "Invalid token: " + e.message)
        }

        assert.http(token, 400, "Invalid token")
        assert.http(typeof token == "object", 400, "Invalid token")

        // @ts-ignore
        assert.http(!token.sim_error, 401, token.sim_error);
    }
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res
 */
module.exports = (req, res) => {

    // Validate FHIR Version ---------------------------------------------------
    let fhirVersion = req.params.fhir_release.toUpperCase();
    let fhirVersionLower = fhirVersion.toLowerCase();
    let fhirServer = config[`fhirServer${fhirVersion}`];

    // FHIR_SERVER_R2_INTERNAL and FHIR_SERVER_R2_INTERNAL env variables can be
    // set to point the request to different location. This is useful when
    // running as a Docker service and the fhir servers are in another service
    // container
    if (process.env["FHIR_SERVER_" + fhirVersion + "_INTERNAL"]) {
        fhirServer = process.env["FHIR_SERVER_" + fhirVersion + "_INTERNAL"];
    }

    if (!fhirServer) {
        return res.status(400).send({
            error: `FHIR server ${req.params.fhir_release} not found`
        });
    }

    // We cannot handle the conformance here!
    if (req.url.match(/^\/metadata/)) {
        return handleMetadataRequest(req, res, fhirServer);
    }

    validateToken(req);
    

    // Build the FHIR request options ------------------------------------------
    let fhirRequestOptions = {
        method: req.method,
        url   : Url.parse(fhirServer + req.url, true),
        gzip  : true
    };

    const isBinary = fhirRequestOptions.url.pathname.indexOf("/Binary/") === 0;

    // Add the body in case of POST or PUT -------------------------------------
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        fhirRequestOptions.body = req.body;
    }

    // Build request headers ---------------------------------------------------
    fhirRequestOptions.headers = Object.assign({}, req.headers);

    if (!isBinary) {
        fhirRequestOptions.headers = Object.assign({}, {
            "content-type": "application/json"
        }, req.headers);
        fhirRequestOptions.headers.accept = fhirVersion === "R2" ?
            "application/json+fhir" :
            "application/fhir+json";
    }

    delete fhirRequestOptions.headers.host;
    delete fhirRequestOptions.headers.authorization;

    // remove custom headers
    for (let name in fhirRequestOptions.headers) {
        if (name.search(/^x-/i) === 0) {
            delete fhirRequestOptions.headers[name];
        }
    }

    // Proxy -------------------------------------------------------------------
    let fullFhirBaseUrl = `${config.baseUrl}/v/${fhirVersionLower}/fhir`;
    let stream = request(fhirRequestOptions)
        .on('error', function(error) {
            console.error(error);
            res.status(502).end(String(error)); // Bad Gateway
        })
        .on('response', response => {
            let contentType = response.headers['content-type'];
            let etag = response.headers['etag']
            let location = response.headers['location']
            res.status(response.statusCode);
            contentType && res.type(contentType);
            etag && res.set('ETag', etag)
            location && res.set('Location', location)
        });

    if (!isBinary) {
        stream = stream.pipe(replStream(fhirServer, fullFhirBaseUrl));
    }

    stream.pipe(res);
};
