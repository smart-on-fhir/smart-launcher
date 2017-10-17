//@ts-nocheck
const jwt        = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router     = require("express").Router({ mergeParams: true });
const config     = require("./config");
const sandboxify = require("./sandboxify");
const Url        = require("url");
const Lib        = require("./lib");
const jwkToPem   = require("jwk-to-pem");

const jwkAsPem = jwkToPem(config.oidcKeypair);

module.exports = router;

function getRequestedSIM(request) {
    let sim = {};
    if (request.query.launch || request.params.sim) {
        try {
            sim = JSON.parse(
                Buffer.from(
                    request.query.launch || request.params.sim,
                    'base64'
                ).toString()
            );
        }
        catch(ex) {
            sim = null;
        }
        finally {
            if (!sim || typeof sim !== "object") {
                sim = {}
            }
        }
    }
    return sim;
}



router.get("/authorize", async function (req, res) {

    /*
        Possible parameters:


        SMART ------------------------------------------------------------------
        response_type
        client_id
        scope
        aud
        redirect_uri
        state

        Custom: sim/launch -----------------------------------------------------
        auth_error
        patient
        provider
        encounter
        launch_prov
        launch_pt
        launch_ehr
        skip_login
        skip_auth

        Custom: flow -----------------------------------------------------------
        login_success
        auth_success
        patient
        provider
        encounter

    */

    let sim = getRequestedSIM(req);

    function buildRedirectUrl(to, query = {}) {
        let redirectUrl = Url.parse(req.originalUrl, true);
        redirectUrl.query = Object.assign(redirectUrl.query, query, {
            aud_validated: sim.aud_validated
        });
        redirectUrl.search = null
        redirectUrl.pathname = redirectUrl.pathname.replace(
            config.authBaseUrl + "/authorize",
            to
        );
        return redirectUrl; //Url.format(redirectUrl);
    }

    // handle response from picker, login or auth screen
    if (req.query.patient      ) sim.patient       = req.query.patient;
    if (req.query.provider     ) sim.provider      = req.query.provider;
    if (req.query.encounter    ) sim.encounter     = req.query.encounter;
    if (req.query.auth_success ) sim.skip_auth     = "1";
    if (req.query.login_success) sim.skip_login    = "1";
    if (req.query.aud_validated) sim.aud_validated = "1";

    // Assert that all the required params are present
    // NOTE that "redirect_uri" MUST be checked first!
    const requiredParams = [
        "redirect_uri",
        "response_type",
        "client_id",
        "scope",
        "state"
    ];
    if (!sim.aud_validated) {
        requiredParams.push("aud");
    }

    const missingParam = Lib.getFirstMissingProperty(req.query, requiredParams);
    if (missingParam) {
        if (missingParam == "redirect_uri") {
            return Lib.replyWithError(res, "missing_parameter", 400, missingParam);
        }
        return Lib.redirectWithError(req, res, "missing_parameter", missingParam);
    }

    let RedirectURL;
    try {
        RedirectURL = Url.parse(req.query.redirect_uri, true);
    } catch (ex) {
        return Lib.replyWithError(res, "bad_redirect_uri", 400, ex.message);
    }

    // Relative redirect_uri like "whatever" will eventually result in wrong URLs like
    // "/auth/whatever". We must only support full http URLs. 
    if (!RedirectURL.protocol) {
        return Lib.replyWithError(res, "no_redirect_uri_protocol", 400, req.query.redirect_uri);
    }

    // simulate errors if requested
    if (sim.auth_error == "auth_invalid_client_id") {
        return Lib.redirectWithError(req, res, "sim_invalid_client_id");
    }

    if (sim.auth_error == "auth_invalid_redirect_uri") {
        return Lib.redirectWithError(req, res, "sim_invalid_redirect_uri");
    }

    if (sim.auth_error == "auth_invalid_scope") {
        return Lib.redirectWithError(req, res, "sim_invalid_scope");
    }

    const apiUrl = sandboxify.buildUrlPath(
        config.baseUrl,
        req.baseUrl.replace(config.authBaseUrl, config.fhirBaseUrl)
    );

    // The "aud" param must match the apiUrl
    if (!sim.aud_validated) {
        if (sandboxify.normalizeUrl(req.query.aud) != sandboxify.normalizeUrl(apiUrl)) {
            return Lib.redirectWithError(req, res, "bad_audience");
        }
        sim.aud_validated = "1";
    }

    // User decided not to authorize the app launch
    if (req.query.auth_success == "0") {
        return Lib.redirectWithError(req, res, "unauthorized");
    }
    
    // PATIENT LOGIN SCREEN
    // -------------------------------------------------------------------------
    // Show login screen if patient launch and skip login is not selected,
    // there's no patient or multiple patients provided
    if (sim.launch_pt && !sim.skip_login) {
        let url = buildRedirectUrl("/login", { patient: sim.patient, aud: "", login_type: "patient" })
        return res.redirect(Url.format(url));
    }

    // PROVIDER LOGIN SCREEN
    // -------------------------------------------------------------------------
    // show login screen if provider launch and skip login is not selected,
    // there's no provider or multiple provider provided
    if ((sim.launch_prov && !sim.skip_login) ||
        (sim.launch_ehr && !sim.skip_login && (!sim.provider || sim.provider.indexOf(",") > -1))) {
        let url = buildRedirectUrl("/login", { provider: sim.provider, aud: "", login_type: "provider" })
        return res.redirect(Url.format(url));
    }

    // PATIENT PICKER
    // -------------------------------------------------------------------------
    // Show patient picker if provider launch, patient scope and no patient
    // or multiple patients provided
    if ((sim.launch_prov || sim.launch_ehr) && req.query.scope.indexOf("patient") != -1 && (!sim.patient || sim.patient.indexOf(",") > -1)) {
        return res.redirect(Url.format(buildRedirectUrl("/picker", { patient: sim.patient, aud: "" })));
    }

    // ENCOUNTER
    // -------------------------------------------------------------------------
    if (sim.launch_ehr && sim.patient && req.query.scope.indexOf("launch") != -1 && !sim.encounter) {
        return res.redirect(Url.format(buildRedirectUrl("/encounter", { patient: sim.patient, select_first: sim.select_encounter != "1", aud: "" })));
    }

    // AUTH SCREEN
    // -------------------------------------------------------------------------
    // Show authorize screen if standalone launch and skip auth is not specified
    else if (!sim.skip_auth && (sim.launch_prov || sim.launch_pt)) {
        return res.redirect(Url.format(buildRedirectUrl("/authorize", { patient: sim.patient, aud: "" })));
    }

    // Build and sign the "code" param
    // -------------------------------------------------------------------------
    let code = {
        context: {
            need_patient_banner: sim.sim_ehr ? false : true,
            smart_style_url: config.baseUrl + "/smart-style.json",
        },
        client_id: req.query.client_id,
        scope: req.query.scope,
    };

    if (sim.launch_pt && sim.patient)
        sim.user = `Patient/${sim.patient}`;

    if (sim.launch_prov && sim.provider)
        sim.user = `Practitioner/${sim.provider}`;

    Object.keys(sim).forEach( param => {
        if (param == "patient" || param == "encounter") {
            code.context[param] = sim[param] == "-1" ? undefined : sim[param];
        } else {
            code[param] = sim[param];
        }
    });

    let signedCode = jwt.sign(code, config.jwtSecret, { expiresIn: "5m" });

    RedirectURL.query.code  = signedCode;
    RedirectURL.query.state = req.query.state;

    // Launch!
    // -------------------------------------------------------------------------
    res.redirect(Url.format(RedirectURL));
});

router.post("/token", bodyParser.urlencoded({ extended: false }), function (req, res) {
    
    if (req.headers["content-type"].indexOf("application/x-www-form-urlencoded") !== 0) {
        return Lib.replyWithError(res, "form_content_type_required", 401);
    }

    var grantType = req.body.grant_type;
    var codeRaw, code;

    if (grantType === 'authorization_code') {
        codeRaw = req.body.code;
    } else if (grantType === 'refresh_token') {
        codeRaw = req.body.refresh_token;
    }

    try {
        code = jwt.verify(codeRaw, config.jwtSecret);
    } catch (e) {
        return Lib.replyWithError(res, "invalid_token", 401, e.message);
    }

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

    if (code.auth_error == "token_invalid_token") {
        return Lib.replyWithError(res, "sim_invalid_token", 401);
    }

    if (code.scope && code.scope.indexOf('offline_access') >= 0) {
        code.context['refresh_token'] = Lib.generateRefreshToken(code);
    }

    var token = Object.assign({}, code.context, {
        token_type: "bearer",
        expires_in: 3600,
        scope     : code.scope,
        client_id : req.body.client_id
    });
    
    if (code.auth_error == "request_invalid_token") {
        token.sim_error = "Invalid token";
    } else if (code.auth_error == "request_expired_token") {
        token.sim_error = "Token expired";
    }

    if (code.user && code.scope.indexOf("profile") > -1 && code.scope.indexOf("openid") > -1) {
        token.id_token = jwt.sign({
                profile: code.user,
                aud: req.body.client_id,
                iss: config.baseUrl
            },
            jwkAsPem,
            {
                algorithm: "HS256"
            }
        );
    }

    token.access_token = jwt.sign(token, config.jwtSecret, { expiresIn: "1h" });
    res.json(token);
});
