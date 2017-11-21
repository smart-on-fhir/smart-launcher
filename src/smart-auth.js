// @ts-no-check
const jwt              = require("jsonwebtoken");
const bodyParser       = require("body-parser");
const router           = require("express").Router({ mergeParams: true });
const config           = require("./config");
const Lib              = require("./lib");
const jwkToPem         = require("jwk-to-pem");
const ScopeSet         = require("./ScopeSet");
const AuthorizeHandler = require("./AuthorizeHandler")

const jwkAsPem = jwkToPem(config.oidcKeypair);

module.exports = router;


router.get("/authorize", AuthorizeHandler.handleRequest);


// TODO: more validations? Signature?
function isInvalidToken(token) {
    if (typeof token != "string") {
        return "The token must be a string";
    }

    if (token.split(".").length != 3) {
        return "Invalid token structure";
    }

    try {
        JSON.parse(new Buffer(token.split(".")[1], "base64").toString("utf8"));
    } catch (ex) {
        return ex.message;
    }

    return false; // not invalid
}


function getTokenContext(req, res) {
    let grantType = req.body.grant_type;

    // Backend Services
    if (grantType === 'client_credentials') {

        // client_assertion_type is required
        if (!req.body.client_assertion_type) {
            Lib.replyWithError(res, "missing_client_assertion_type", 401);
            return null;
        }

        // client_assertion_type must have a fixed value
        if (req.body.client_assertion_type != "urn:ietf:params:oauth:client-assertion-type:jwt-bearer") {
            Lib.replyWithError(res, "invalid_client_assertion_type", 401);
            return null;
        }

        // client_assertion must be a token
        let tokenError = isInvalidToken(req.body.client_assertion)
        if (tokenError) {
            Lib.replyWithError(res, "invalid_registration_token", 401, tokenError);
            return null;
        }

        let authenticationToken = String(req.body.client_assertion).split(".")[1];
        authenticationToken = new Buffer(authenticationToken, "base64").toString("utf8");
        authenticationToken = JSON.parse(authenticationToken);

        // The client_id must be a token
        tokenError = isInvalidToken(authenticationToken.sub)
        if (tokenError) {
            Lib.replyWithError(res, "invalid_client_details_token", 401, tokenError);
            return null;
        }
        
        let clientDetailsToken = String(authenticationToken.sub).split(".")[1];
        clientDetailsToken = new Buffer(clientDetailsToken, "base64").toString("utf8");
        clientDetailsToken = JSON.parse(clientDetailsToken);

        // simulate expired_registration_token error
        if (clientDetailsToken.auth_error == "token_expired_registration_token") {
            Lib.replyWithError(res, "token_expired_registration_token", 401);
            return null;
        }

        // Validate authenticationToken.aud (must equal this url)
        let tokenUrl = config.baseUrl + req.originalUrl;
        if (tokenUrl.replace(/^https?/, "") !== authenticationToken.aud.replace(/^https?/, "")) {
            Lib.replyWithError(res, "invalid_aud", 401, tokenUrl);
            return null;
        }

        // Validate authenticationToken.iss (must equal whatever the user entered at
        // registration time, i.e. clientDetailsToken.iss)
        if (authenticationToken.iss !== clientDetailsToken.iss) {
            Lib.replyWithError(res, "invalid_token_iss", 401, authenticationToken.iss, clientDetailsToken.iss);
            return null;
        }

        // simulated invalid_jti error
        if (clientDetailsToken.auth_error == "invalid_jti") {
            Lib.replyWithError(res, "invalid_jti", 401);
            return null;
        }

        // Validate scope
        tokenError = ScopeSet.getInvalidSystemScopes(req.body.scope);
        if (tokenError) {
            Lib.replyWithError(res, "invalid_scope", 401, tokenError);
            return null;
        }

        // simulated token_invalid_scope
        if (clientDetailsToken.auth_error == "token_invalid_scope") {
            Lib.replyWithError(res, "token_invalid_scope", 401);
            return null;
        }

        try {
            jwt.verify(req.body.client_assertion, base64url.decode(clientDetailsToken.pub_key), { algorithm: "RS256" });
        } catch (e) {
            Lib.replyWithError(res, "invalid_token", 401, e.message);
            return null;
        }

        return clientDetailsToken;
    }
    else {
        let codeRaw;

        // The most common case - an app is authorizing
        if (grantType === 'authorization_code') {
            codeRaw = req.body.code;
        }

        // An app posts a refresh token to renew it's session
        else if (grantType === 'refresh_token') {
            codeRaw = req.body.refresh_token;
        }

        try {
            code = jwt.verify(codeRaw, config.jwtSecret);
        } catch (e) {
            Lib.replyWithError(res, "invalid_token", 401, e.message);
            return null
        }

        return code;
    }
}


router.post("/token", bodyParser.urlencoded({ extended: false }), function (req, res) {

    if (!req.headers["content-type"] || req.headers["content-type"].indexOf("application/x-www-form-urlencoded") !== 0) {
        return Lib.replyWithError(res, "form_content_type_required", 401);
    }

    let code = getTokenContext(req, res);
    if (!code) {
        return;
    }

    let grantType = req.body.grant_type, scopes;

    // Request from confidential client
    if (req.headers.authorization && req.headers.authorization.search(/^basic\s*/i) === 0) {

        // Simulate invalid client secret error
        if (req.body.auth_error == "auth_invalid_client_secret" ||
            code.auth_error == "auth_invalid_client_secret") {
            return Lib.replyWithError(res, "sim_invalid_client_secret", 401);
        }

        let auth = req.headers.authorization.replace(/^basic\s*/i, "");
        
        // Check for empty auth
        if (!auth) {
            return Lib.replyWithError(res, "empty_auth_header", 401, req.headers.authorization);
        }

        // Check for invalid base64
        try {
            auth = new Buffer(auth, "base64").toString().split(":");
        } catch (err) {
            return Lib.replyWithError(res, "bad_auth_header", 401, req.headers.authorization, err.message);
        }

        // Check for bad auth syntax
        if (auth.length != 2) {
            let msg = "The decoded header must contain '{client_id}:{client_secret}'";
            return Lib.replyWithError(res, "bad_auth_header", 401, req.headers.authorization, msg);
        }
    }

    scopes = new ScopeSet(decodeURIComponent(code.scope));

    if (code.auth_error == "token_invalid_token") {
        return Lib.replyWithError(res, "sim_invalid_token", 401);
    }

    if (grantType == 'refresh_token' && code.auth_error == "token_expired_refresh_token") {
        return Lib.replyWithError(res, "sim_expired_refresh_token", 401);
    }

    if (scopes.has('offline_access') || scopes.has('online_access')) {
        code.context['refresh_token'] = Lib.generateRefreshToken(code);
    }

    var token = Object.assign({}, code.context, {
        token_type: "bearer",
        expires_in: code.accessTokensExpireIn ?
            code.accessTokensExpireIn * 60 :
            grantType === 'client_credentials' ?
                15 * 60 :
                60 * 60,
        scope     : code.scope,
        client_id : req.body.client_id
    });

    if (code.auth_error == "request_invalid_token") {
        token.sim_error = "Invalid token";
    } else if (code.auth_error == "request_expired_token") {
        token.sim_error = "Token expired";
    }

    if (code.user && scopes.has("profile") && scopes.has("openid")) {
        let secure = req.secure || req.headers["x-forwarded-proto"] == "https";
        let iss = config.baseUrl.replace(/^https?/, secure ? "https" : "http");
        token.id_token = jwt.sign({
            profile: code.user,
            aud    : req.body.client_id,
            sub    : code.user,
            iss
        },
        jwkAsPem,
        {
            algorithm: "HS256",
            expiresIn: `${(code.accessTokensExpireIn || 60)} minutes`
        });
    }

    token.access_token = jwt.sign(token, config.jwtSecret, {
        expiresIn: `${(code.accessTokensExpireIn || 60)} minutes`
    });

    // console.log(token, {
    //     profile: code.user,
    //     aud    : req.body.client_id,
    //     sub    : code.user,
    //     iss    : "https://launch.smarthealthit.org/v/r2/fhir"//config.baseUrl
    // })
    res.json(token);
});

/**
 * This should handle the client registration used by the back-end services.
 */
router.post("/register-backend-client", bodyParser.urlencoded({ extended: false }), function(req, res) {

    // Require "application/x-www-form-urlencoded" POSTs
    if (!req.headers["content-type"] || req.headers["content-type"].indexOf("application/x-www-form-urlencoded") !== 0) {
        return Lib.replyWithError(res, "form_content_type_required", 401);
    }

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
});
