const got        = require("got")
const jwt        = require("jsonwebtoken")
const replStream = require("replacestream")
const config     = require("./config")
const Lib        = require("./lib")

const assert = Lib.assert;

/**
 * Given a conformance statement (as JSON string), replaces the auth URIs with
 * new ones that point to our proxy server. Also add the rest.security.service
 * field.
 * @param {object} json A conformance statement as JSON
 * @param {String} baseUrl  The baseUrl of our server
 * @returns {Object|null} Returns the modified JSON object or null in case of error
 */
function augmentConformance(json, baseUrl) {
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

async function handleMetadataRequest(req, res, fhirServer)
{
    const url = Lib.buildUrlPath(fhirServer, req.url);
    let requestUrl = Lib.buildUrlPath(config.baseUrl, req.originalUrl);

    const response = await got.get(url, {
        throwHttpErrors: false,
        json: true,
        rejectUnauthorized: false,
        hooks: {
            afterResponse: [
                response => {
                    // adjust urls in the fhir response so future requests will hit the proxy
                    response.body = response.body.replaceAll(fhirServer, requestUrl)
                    return response
                }
            ]
        }
    });

    let { statusCode, body } = response;

    // pass through the statusCode
    res.status(statusCode);

    // Inject the SMART information
    let baseUrl = Lib.buildUrlPath(config.baseUrl, req.baseUrl.replace("/fhir", ""));
    let secure = req.secure || req.headers["x-forwarded-proto"] == "https";
    baseUrl = baseUrl.replace(/^https?/, secure ? "https" : "http");
    augmentConformance(body, baseUrl);

    res.set("content-type", "application/json; charset=utf-8");
    res.send(JSON.stringify(body, null, 4));
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
    let fhirVersion      = req.params.fhir_release.toUpperCase();
    let fhirVersionLower = fhirVersion.toLowerCase();
    let fhirServer       = config[`fhirServer${fhirVersion}`];

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
        url   : new URL(req.url, fhirServer).href,
        throwHttpErrors: false,
        rejectUnauthorized: false
    };

    const isBinary = req.url.indexOf("/Binary/") === 0;

    // Add the body in case of POST or PUT -------------------------------------
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        fhirRequestOptions.body = req.body;
    }

    // Build request headers ---------------------------------------------------
    fhirRequestOptions.headers = { ...req.headers };

    if (!isBinary) {
        fhirRequestOptions.headers = {
            "content-type": "application/json",
            ...req.headers
        };
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
    try {
        let stream = got.stream(fhirRequestOptions)
            .on('error', function(error) {
                console.error(error);
                res.status(502).end(String(error)); // Bad Gateway
            })
            .on('response', response => {
                if (response.statusCode) res.status(response.statusCode);
                ["content-type", 'etag', 'location'].forEach(name => {
                    if (name in response.headers) {
                        res.set(name, response.headers[name])
                    }
                })
            });

        if (!isBinary) {
            // stream = stream.pipe(replStream(fhirServer, `${config.baseUrl}/v/${fhirVersionLower}/fhir`));
            stream = stream.pipe(replStream(fhirServer, `${Lib.getRequestBaseURL(req)}/v/${fhirVersionLower}/fhir`));
        }

        stream.pipe(res);
    } catch (ex) {
        res.end(ex.message)
    }
};
