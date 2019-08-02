// @ts-check
const Url        = require("url");
const request    = require("request");
const jwt        = require("jsonwebtoken");
const replStream = require("replacestream");
const config     = require("./config");
const patientMap = require("./patient-compartment");
const Lib        = require("./lib");

require("colors");


module.exports = (req, res) => {

    // We cannot handle the conformance here!
    if (req.url.match(/^\/metadata/)) {
        return require("./reverse-proxy")(req, res);
    }

    let logTime = Lib.bool(process.env.LOG_TIMES) ? Date.now() : null;

    let token = null;

    // Validate token ----------------------------------------------------------
    if (req.headers.authorization) {

        // require a valid auth token if there is an auth token
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

        // Simulated errors
        if (token.sim_error) {
            return res.status(401).send(token.sim_error);
        }
    }

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

    // Build the FHIR request options ------------------------------------------
    let fhirRequestOptions = {
        method: req.method,
        url   : Url.parse(fhirServer + req.url, true),
        gzip  : true
    };

    const isBinary = fhirRequestOptions.url.pathname.indexOf("/Binary/") === 0;

    // if applicable, apply patient scope to GET requests, largely for
    // performance reasons. Full scope support can't be implemented in a proxy
    // because it would require "or" conditions in FHIR API calls (ie ),
    // but should do better than this!
    if (req.method == "GET") {
        let scope   = (token && token.scope  ) || req.headers["x-scope"];
        let patient = (token && token.patient) || req.headers["x-patient"];
        if (scope && patient && scope.indexOf("user/") == -1) {
            let resourceType = req.url.slice(1);
            let prop = patientMap[fhirVersionLower] && patientMap[fhirVersionLower][resourceType];
            if (prop) {
                fhirRequestOptions.url.query[prop] = patient;
            }
        }
    }

    // Add the body in case of POST or PUT -------------------------------------
    if (req.method === "POST" || req.method === "PUT") {
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

    if (fhirRequestOptions.headers.hasOwnProperty("host")) {
        delete fhirRequestOptions.headers.host;
    }

    if (fhirRequestOptions.headers.hasOwnProperty("authorization")) {
        delete fhirRequestOptions.headers.authorization;
    }

    // remove custom headers
    for (let name in fhirRequestOptions.headers) {
        if (name.search(/^x-/i) === 0) {
            delete fhirRequestOptions.headers[name];
        }
    }

    // Proxy -------------------------------------------------------------------
    let fullFhirBaseUrl = `${config.baseUrl}/v/${fhirVersionLower}${config.fhirBaseUrl}`;
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
            if (logTime) {
                console.log(
                    ("Simple Proxy: ".bold + Url.format(fhirRequestOptions.url) + " -> ").cyan +
                    String((Date.now() - logTime) + "ms").yellow.bold
                );
            }
        });

    if (!isBinary) {
        stream = stream.pipe(replStream(fhirServer, fullFhirBaseUrl));
    }

    stream.pipe(res);
};
