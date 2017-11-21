// @ts-check
const request    = require("request");
const jwt        = require("jsonwebtoken");
const config     = require("./config");
const replStream = require("replacestream");
const Url        = require("url");
const patientMap = require("./patient-compartment");

require("colors");


module.exports = function (req, res) {

    if (req.url.match(/^\/metadata/)) {
        return require("./reverse-proxy")(req, res);
    }

    let logTime = process.env.LOG_TIMES ? Date.now() : null;

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
            return res.status(401).send(`${e.name || "Error"}: ${e.message || "Invalid token"}`);
        }

        // Simulate invalid token error
        if (token.sim_error) {
            return res.status(401).send(token.sim_error);
        }
    }

    // Validate FHIR Version ---------------------------------------------------
    let fhirVersion = req.params.fhir_release.toUpperCase();
    let fhirVersionLower = fhirVersion.toLowerCase();
    let fhirServer = config[`fhirServer${fhirVersion}`];
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
    fhirRequestOptions.headers = Object.assign({}, {
        "content-type": "application/json"
    }, req.headers, {
        // set everything to JSON since we don't currently support XML and
        // block XML requests at a middleware layer
        "accept": fhirVersion == "R2" ?
            "application/json+fhir" :
            "application/fhir+json"
    });

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
    // const chunks = [];
    request(fhirRequestOptions)
    
        // .on('data', (chunk) => {
        //     chunks.push(chunk.toString());
        // })
        // .on('end', () => {
        //     console.log(fhirRequestOptions, chunks.join(''));
        // })
        .on('response', response => {
            let contentType = response.headers['content-type'];
            res.status(response.statusCode);
            contentType && res.type(contentType);
            // var x = response.toJSON();
            if (logTime) {
                console.log(
                    ("Simple Proxy: ".bold + Url.format(fhirRequestOptions.url) + " -> ").cyan +
                    String((Date.now() - logTime) + "ms").yellow.bold
                );
            }
        })
        .pipe(replStream(fhirServer, fullFhirBaseUrl))
        .pipe(res);

};
