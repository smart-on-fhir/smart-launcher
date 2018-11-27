const request    = require("request");
const jwt        = require("jsonwebtoken");
const config     = require("./config");
const fhirError  = require("./fhir-error");
const patientMap = require("./patient-compartment");
const Lib        = require("./lib");
require("colors");

// Pre-define any RegExp as global to improve performance
const RE_RESOURCE_SLASH_ID = new RegExp(
    "([A-Z]\\w+)"     + // Resource type
    "(\\/([^\\/?]+))" + // Resource ID
    "\\/?(\\?|$)"       // Anything after (like a query string)
);

module.exports = function (req, res) {

    let logTime = process.env.LOG_TIMES ? Date.now() : null;

    let token = null;
    let sandboxes = req.params.sandbox && req.params.sandbox.split(",");
    let isSearchPost = req.method == "POST" && req.url.endsWith("/_search");
    let fhirRelease = (req.params.fhir_release || "").toUpperCase();
    let fhirServer = config["fhirServer" + fhirRelease];

    // FHIR_SERVER_R2_INTERNAL and FHIR_SERVER_R2_INTERNAL env variables can be
    // set to point the request to different location. This is useful when
    // running as a Docker service and the fhir servers are in another service
    // container
    if (process.env["FHIR_SERVER_" + fhirRelease + "_INTERNAL"]) {
        fhirServer = process.env["FHIR_SERVER_" + fhirRelease + "_INTERNAL"];
    }

    if (!fhirServer) {
        return res.status(400).send({
            error: `FHIR server ${req.params.fhir_release} not found`
        });
    }
    
    // only allow gets to blacklisted sandboxes (like the SMART default patients)
    if (req.method != "GET" && !req.url.endsWith("/_search") && (
        !sandboxes ||
        config.protectedSandboxWords.find( w => sandboxes[0].toLowerCase().indexOf(w) != -1 )
    )) {
        return res.status(401).send( fhirError("You do not have permission to modify this sandbox") );
    }

    // require a valid auth token if there is an auth token
    if (req.headers.authorization) {
        try {
            token = jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret);
        } catch (e) {
            return res.status(401).send(`${e.name || "Error"}: ${e.message || "Invalid token"}`);
        }
        if (token.sim_error) {
            return res.status(401).send(token.sim_error);
        }
    }

    // set everything to JSON since we don't currently support XML and block XML
    // requests at a middleware layer
    let fhirRequest = {
        headers: {
            "content-type": "application/json",
            "accept"      : req.params.fhir_release.toUpperCase() == "R2" ? "application/json+fhir" : "application/fhir+json"
        },
        method: req.method
    }
    
    // inject sandbox tag into POST and PUT requests and make urls conditional
    // -------------------------------------------------------------------------
    if (isSearchPost) {
        fhirRequest.body = req.body;
        fhirRequest.headers["content-type"] = req.headers["content-type"];
        // fhirRequest.body = String(fhirRequest.body) + "&_tag=" + sandboxes.join("&");
    }
    else if (Object.keys(req.body).length) {
        fhirRequest.body = Lib.adjustRequestBody(req.body, config.sandboxTagSystem, sandboxes);
        fhirRequest.body = Buffer.from(JSON.stringify(fhirRequest.body), 'utf8');
        fhirRequest.headers['content-length'] = Buffer.byteLength(fhirRequest.body)
    }

    // make urls conditional and if exists, change /id to ?_id=
    if (isSearchPost) {
        fhirRequest.url = Lib.buildUrlPath(
            fhirServer, req.url
        );
    }
    else {
        fhirRequest.url = Lib.buildUrlPath(
            fhirServer, Lib.adjustUrl(req.url, req.method == "GET", sandboxes)
        );
    }

    // if applicable, apply patient scope to GET requests, largely for
    // performance reasons. Full scope support can't be implemented in a proxy
    // because it would require "or" conditions in FHIR API calls (ie ),
    // but should do better than this!
    let scope = (token && token.scope) || req.headers["x-scope"];
    let patient = (token && token.patient) || req.headers["x-patient"];
    if (req.method == "GET" && scope && patient && scope.indexOf("user/") == -1) {
        let resourceType = req.url.slice(1);
        let map = patientMap[req.params.fhir_release] && patientMap[req.params.fhir_release][resourceType];
        if (map) fhirRequest.url += "&" + map + "=" + patient;
    }

    //proxy the request to the real FHIR server
    if (!logTime && process.env.NODE_ENV == "development") {
        console.log("PROXY: " + fhirRequest.url, fhirRequest);
    }

    request(fhirRequest, function(error, response, body) {
        if (error) {
            // res.status(500)
            // res.type("application/json")
            return res.send(JSON.stringify(error, null, 4));
        }
        res.status(response.statusCode);
        response.headers['content-type'] && res.type(response.headers['content-type']);
     
        // adjust urls in the fhir response so future requests will hit the proxy
        if (body) {
            let requestUrl = Lib.buildUrlPath(config.baseUrl, req.originalUrl);
            let requestBaseUrl = Lib.buildUrlPath(config.baseUrl, req.baseUrl)
            body = Lib.adjustResponseUrls(body, fhirRequest.url, requestUrl, fhirServer, requestBaseUrl);
        }

        // special handler for metadata requests - inject the SMART information
        if (req.url.match(/^\/metadata/) && response.statusCode == 200 && body.indexOf("fhirVersion") != -1) {
            let authBaseUrl = Lib.buildUrlPath(config.baseUrl, req.baseUrl.replace(config.fhirBaseUrl, config.authBaseUrl));
            let secure = req.secure || req.headers["x-forwarded-proto"] == "https";
            authBaseUrl = authBaseUrl.replace(/^https?/, secure ? "https" : "http");
            body = Lib.addAuthToConformance(body, authBaseUrl);
            if (!body) {
                res.status(404);
                body = fhirError(`Error reading server metadata`);
            }
        }

        // pull the resource out of the bundle if we converted a /id url into a ?_id= query
        if (req.method =="GET" && RE_RESOURCE_SLASH_ID.test(req.url) && typeof body == "string" && body.indexOf("Bundle") != -1) {
            body = Lib.unBundleResource(body);
            if (!body) {
                res.status(404);
                body = fhirError(`Resource ${req.url.slice(1)} is not known`);
            }
            body = JSON.stringify(body, null, 4);
        }

        // pretty print if called from a browser
        // TODO: use a template and syntax highlight json response
        if (req.headers.accept &&
            req.headers.accept.toLowerCase().indexOf("html") > -1 &&
            req.originalUrl.toLowerCase().indexOf("_pretty=false") == -1
        ) {
            body = (typeof body == "string" ? body : JSON.stringify(body, null, 4));
            body = `<html><body><pre>${Lib.htmlEncode(body)}</pre></body></html>`;
            res.type("html");
        }
        
        if (logTime) {
            console.log(
                ("Reverse Proxy: ".bold + fhirRequest.url + " -> ").cyan +
                String((Date.now() - logTime) + "ms").yellow.bold
            );
        }

        res.send(body);
    });
    
};
