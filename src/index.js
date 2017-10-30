const express      = require("express");
const cors         = require("cors");
const path         = require("path");
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const smartAuth    = require("./smart-auth");
const reverseProxy = require("./reverse-proxy");
const simpleProxy  = require("./simple-proxy");
const config       = require("./config");
const fhirError    = require("./fhir-error");
const fs           = require('fs');
const https        = require('https');
const http         = require("http");
const sandboxify   = require("./sandboxify");
const lib          = require('./lib');
const privateKey   = fs.readFileSync('./privatekey.pem', 'utf8');
const certificate  = fs.readFileSync('./cert.pem', 'utf8');
const credentials  = {key: privateKey, cert: certificate};


const handleParseError = function(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400)
            .send( fhirError(`Failed to parse JSON content, error was: ${err.message}`) );
    } else {
        next(err, req, res);
    }
}

const handleXmlRequest = function(err, req, res, next) {
    if (
        req.headers.accept &&req.headers.accept.indexOf("xml") != -1 || 
        req.headers['content-type'] && req.headers['content-type'].indexOf("xml") != -1 ||
        /_format=.*xml/i.test(req.url)
    ) {
        return res.status(400).send( fhirError("XML format is not supported") )
    } else {
        next(err, req, res)
    }
}

const app = express();

app.use(cors());

if (process.env.NODE_ENV == "development") {
    app.use(logger('combined'));
}

//reject xml
app.use(handleXmlRequest);

//provide oidc keys when requested
app.get("/.well-known/openid-configuration/", (req, res) => {
    res.json({"jwks_uri": `${config.baseUrl}/keys`})
});
app.get("/keys", (req, res) => {
    let key = {}
    Object.keys(config.oidcKeypair).forEach(p => {
        if (p != "d") key[p] = config.oidcKeypair[p];
    });
    res.json({"keys":[key]})
});

buildRoutePermutations = (lastSegment) => {
    return [
        "/v/:fhir_release/sb/:sandbox/sim/:sim" + lastSegment,
        "/v/:fhir_release/sb/:sandbox" + lastSegment,
        "/v/:fhir_release/sim/:sim" + lastSegment,
        "/v/:fhir_release" + lastSegment
    ];
}

// picker
app.get(buildRoutePermutations("/picker"), (req, res) => {
    res.sendFile("picker.html", {root: './static'});
});

// encounter picker
app.get(buildRoutePermutations("/encounter"), (req, res) => {
    res.sendFile("encounter-picker.html", {root: './static'});
});

// login
app.get(buildRoutePermutations("/login"), (req, res) => {
    res.sendFile("login.html", {root: './static'});
});

// authorize
app.get(buildRoutePermutations("/authorize"), (req, res) => {
    res.sendFile("authorize.html", {root: './static'});
});

// auth request
app.use(buildRoutePermutations(config.authBaseUrl), smartAuth)

// fhir request using sandboxes (tags)
app.use(
    [
        `/v/:fhir_release/sb/:sandbox/sim/:sim${config.fhirBaseUrl}`,
        `/v/:fhir_release/sb/:sandbox${config.fhirBaseUrl}`
    ],
    bodyParser.text({ type: "*/*", limit: 1e6 }),
    handleParseError,
    reverseProxy
);

// fhir request - no sandboxes - fast streaming proxy
app.use(
    [
        `/v/:fhir_release/sim/:sim${config.fhirBaseUrl}`,
        `/v/:fhir_release${config.fhirBaseUrl}`
    ],
    bodyParser.text({ type: "*/*", limit: 1e6 }),
    handleParseError,
    simpleProxy
);

// static request
app.use(express.static("static"));

module.exports = app;

if (!module.parent) {
    if (config.useSSL) {
        https.createServer(credentials, app).listen(config.port);
        console.log(`Proxy server running on https://localhost:${config.port}`);
    } else {
        app.listen(config.port, function () {
            console.log(`Example app listening on port ${config.port}!`)
        });
    }
}
