const express      = require("express");
const cors         = require("cors");
const bodyParser   = require('body-parser');
const smartAuth    = require("./smart-auth");
const reverseProxy = require("./reverse-proxy");
const simpleProxy  = require("./simple-proxy");
const config       = require("./config");
const fhirError    = require("./fhir-error");
const generator    = require("./generator");
const lib          = require("./lib");


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

app.use(cors({
    origin: true,
    credentials: true
}));

if (process.env.NODE_ENV == "development") {
    app.use(require('morgan')('combined'));
}

// HTTP to HTTPS redirect (this is Heroku-specific!)
// app.use((req, res, next) => {
//     let proto = req.headers["x-forwarded-proto"];
//     let host  = req.headers.host;
//     if (proto && (`${proto}://${host}` !== config.baseUrl)) { 
//         return res.redirect(301, config.baseUrl + req.url);
//     }
//     next();
// });

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
        `/v/:fhir_release/sb/:sandbox${config.fhirBaseUrl}`,
        // `/v/:fhir_release/sim/:sim${config.fhirBaseUrl}`,
        // `/v/:fhir_release${config.fhirBaseUrl}`
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

app.use("/generator", generator);

app.use("/env.js", (req, res) => {
    const out = {};

    const whitelist = {
        "NODE_ENV"                : String,
        "LOG_TIMES"               : lib.bool,
        "DISABLE_SANDBOXES"       : lib.bool,
        "DISABLE_BACKEND_SERVICES": lib.bool,
        "GOOGLE_ANALYTICS_ID"     : String
    };

    Object.keys(whitelist).forEach(key => {
        if (process.env.hasOwnProperty(key)) {
            out[key] = whitelist[key](process.env[key]);
        }
    });

    res.type("javascript").send(`var ENV = ${JSON.stringify(out, null, 4)};`);
});

// static request
app.use(express.static("static"));

module.exports = app;

if (!module.parent) {
    app.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}!`)
    });
}
