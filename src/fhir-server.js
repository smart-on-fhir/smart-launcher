/**
 * This file defines a router for a virtual server. A virtual server is mostly
 * just a pair of FHIR server for specific FHIR version and an auth server.
 * These virtual server routers will be mounted on two parallel locations:
 * - `{base}/v/{fhirVersion}`           - default server
 * - `{base}/v/{fhirVersion}/sim/{sim}` - with additional metadata in the {sim}
 */

const express                  = require("express")
const { util: { base64url }}   = require("node-jose")
const wellKnownOIDC            = require("./wellKnownOIDCConfiguration")
const wellKnownSmart           = require("./wellKnownSmartConfiguration")
const AuthorizeHandler         = require("./AuthorizeHandler")
const handleRegistration       = require("./RegistrationHandler")
const TokenHandler             = require("./TokenHandler")
const { introspectionHandler } = require("./introspect")
const simpleProxy              = require("./simple-proxy")

const fhirServer = module.exports = express.Router({ mergeParams: true })
const urlencoded = express.urlencoded({ extended: false, limit: '64kb' })
const text       = express.text({ type: "*/*", limit: 1e6 })

// Authorization endpoints
// -----------------------------------------------------------------------------

fhirServer.get("/auth/authorize", AuthorizeHandler.handleRequest)

fhirServer.post("/auth/token", urlencoded, TokenHandler.handleRequest)

fhirServer.post("/auth/register", urlencoded, handleRegistration)

fhirServer.post("/auth/introspect", urlencoded, introspectionHandler)


// Metadata endpoints
// -----------------------------------------------------------------------------

fhirServer.get("/.well-known/smart-configuration",  wellKnownSmart)

fhirServer.get("/.well-known/openid-configuration",  wellKnownOIDC)


// UI endpoints
// -----------------------------------------------------------------------------

// patient picker
fhirServer.get("/picker", (_, res) => res.sendFile("picker.html", { root: './static' }))

// encounter picker
fhirServer.get("/encounter", (_, res) => res.sendFile("encounter-picker.html", { root: './static' }))

// user picker
fhirServer.get("/login", (_, res) => res.sendFile("login.html", { root: './static' }))

// approve launch dialog
fhirServer.get("/authorize", (_, res) => res.sendFile("authorize.html", { root: './static' }))


// Other endpoints
// -----------------------------------------------------------------------------

// Provide launch_id if the CDS Sandbox asks for it
fhirServer.post("/fhir/_services/smart/launch", express.json(), (req, res) => {
    res.json({
        launch_id: base64url.encode(JSON.stringify({
            context: req.body.parameters || {}
        }))
    });
});

// Proxy everything else under `/fhir` to the underlying FHIR server
fhirServer.use("/fhir", text, simpleProxy);


