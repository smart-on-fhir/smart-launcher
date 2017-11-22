const jwt          = require("jsonwebtoken");
const config       = require("./config");
const SMARTHandler = require("./SMARTHandler");
const Lib          = require("./lib");

class RegistrationHandler extends SMARTHandler {

    static handleRequest(req, res) {
        return new RegistrationHandler(req, res).handle();
    }

    // constructor(req, res) {
    //     super(req, res);
    //     // this.sim   = this.getRequestedSIM();
    //     // this.scope = new ScopeSet(decodeURIComponent(req.query.scope));
    // }

    handle() {
        const req = this.request;
        const res = this.response;

        // Require "application/x-www-form-urlencoded" POSTs
        if (!req.headers["content-type"] || req.headers["content-type"].indexOf("application/x-www-form-urlencoded") !== 0) {
            return Lib.replyWithError(res, "form_content_type_required", 401);
        }

        this.handleBackendServiceRegistration();
    }

    handleBackendServiceRegistration() {
        const req = this.request;
        const res = this.response;

        // parse and validate the "iss" parameter
        let iss = String(req.body.iss || "").trim();
        if (!iss) {
            return Lib.replyWithError(res, "missing_parameter", 400, "iss");
        }

        // parse and validate the "pub_key" parameter
        let publicKey = String(req.body.pub_key || "").trim();
        if (!publicKey) {
            return Lib.replyWithError(res, "missing_parameter", 400, "pub_key");
        }

        // parse and validate the "dur" parameter
        let dur = parseInt(req.body.dur || "15", 10);
        if (isNaN(dur) || !isFinite(dur) || dur < 0) {
            return Lib.replyWithError(res, "invalid_parameter", 400, "dur");
        }

        // Build the result token
        let jwtToken = {
            pub_key: publicKey,
            iss
        };

        // Note that if dur is 0 accessTokensExpireIn will not be included
        if (dur) {
            jwtToken.accessTokensExpireIn = dur;
        }

        // Custom errors (if any)
        if (req.body.auth_error) {
            jwtToken.auth_error = req.body.auth_error;
        }

        // Reply with signed token as text
        res.type("text").send(jwt.sign(jwtToken, config.jwtSecret));
    }
}

module.exports = RegistrationHandler;
