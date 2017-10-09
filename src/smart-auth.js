const jwt        = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router     = require("express").Router({ mergeParams: true });
const config     = require('./config');
const sandboxify = require("./sandboxify");
const Url        = require('url');

module.exports = router;

function requireParams(object, requiredParams) {
    const missingParam = requiredParams.find(param => {
        if (!object[param]) {
            return param;
        }
    });
    if (missingParam) {
        return `Missing ${missingParam} parameter`;
    }
    return null
}

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


    SMART ----------------------------------------------------------------------
    response_type
    client_id
    scope
    aud
    redirect_uri
    state

    Custom: sim/launch ---------------------------------------------------------
    auth_error
    patient
    provider
    encounter
    launch_prov
    launch_pt
    launch_ehr
    skip_login
    skip_auth

    Custom: flow ---------------------------------------------------------------
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
    if (sim.user               ) sim.provider      = sim.user;
    if (req.query.provider     ) sim.provider      = req.query.provider;
    if (req.query.encounter    ) sim.encounter     = req.query.encounter;
    if (req.query.auth_success ) sim.skip_auth     = "1";
    if (req.query.login_success) sim.skip_login    = "1";
    if (req.query.aud_validated) sim.aud_validated = "1";

    // Assert that all the required params are present
    const requiredParams = ["response_type", "client_id", "redirect_uri", "scope", "state"];
    if (!sim.aud_validated) requiredParams.push("aud");
    const missingParam = requireParams(req.query, requiredParams);
    if (missingParam) return res.status(400).send(`Missing ${missingParam} parameter`);


    let RedirectURL;
    try {
        RedirectURL = Url.parse(req.query.redirect_uri, true);
    } catch (ex) {
        return res.status(400).send(ex.message); 
    }

    // Relative redirect_uri like "whatever" will eventually result in wrong URLs like
    // "/auth/whatever". We must only support full http URLs.
    if (RedirectURL.protocol != "http:" && RedirectURL.protocol != "https:") {
        return res.status(400).send(`Invalid "redirect_uri" parameter "${req.query.redirect_uri}" (must be http or https URL).`);
    }

    

    // simulate errors if requested
    if (sim.auth_error == "auth_invalid_client_id") {
        return res.status(400).send("Invalid client_id parameter");
    }
    if (sim.auth_error == "auth_invalid_redirect_uri") {
        return res.status(400).send("Invalid redirect_uri parameter");
    }
    if (sim.auth_error == "auth_invalid_scope") {
        return res.status(400).send("Invalid scope parameter");
    }

    const apiUrl = sandboxify.buildUrlPath(
        config.baseUrl,
        req.baseUrl.replace(config.authBaseUrl, config.fhirBaseUrl)
    );

    // The "aud" param must match the apiUrl
    if (!sim.aud_validated) {
        if (sandboxify.normalizeUrl(req.query.aud) != sandboxify.normalizeUrl(apiUrl)) {
            return res.status(400).send("Bad audience value");
        }
        sim.aud_validated = "1";
    }

    // User decided not to authorize the app launch
    if (req.query.auth_success == "0") {
        return res.status(401).send("Unauthorized");
    }
    
    // PATIENT LOGIN SCREEN
    // -------------------------------------------------------------------------
    // Show login screen if patient launch and skip login is not selected,
    // there's no patient or multiple patients provided
    if (sim.launch_pt && !sim.skip_login && (!sim.patient || sim.patient.indexOf(",") > -1)) {
        let url = buildRedirectUrl("/login", { patient: sim.patient, aud: "", login_type: "patient" })
        return res.redirect(Url.format(url));
    }

    // PROVIDER LOGIN SCREEN
    // -------------------------------------------------------------------------
    // show login screen if provider launch and skip login is not selected,
    // there's no provider or multiple provider provided
    if ((sim.launch_prov || sim.launch_ehr) && !sim.skip_login && (!sim.provider || sim.provider.indexOf(",") > -1)) {
        let url = buildRedirectUrl("/login", { provider: sim.provider, aud: "", login_type: "provider" })
        // url.query.aud = undefined
        console.log(Url.format(url))
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
    var code = {
        context: {
            need_patient_banner: sim.sim_ehr ? false : true,
            smart_style_url: config.baseUrl + "/smart-style.json",
        },
        client_id: req.query.client_id,
        scope: req.query.scope,
    };

    Object.keys(sim).forEach( param => {
        if (["patient", "encounter"].indexOf(param) != -1) {
            code.context[param] = sim[param] == "-1" ? undefined : sim[param];
        } else {
            code[param] = sim[param];
        }
    });

    var signedCode = jwt.sign(code, config.jwtSecret, { expiresIn: "5m" });
    
    RedirectURL.query.code = signedCode
    RedirectURL.query.state = req.query.state

    // Launch!
    // -------------------------------------------------------------------------
    res.redirect(Url.format(RedirectURL));
});

router.post("/token", bodyParser.urlencoded({ extended: false }), function (req, res) {
    
    if (req.headers["content-type"].indexOf("application/x-www-form-urlencoded") !== 0) {
        return res.status(401).send('Invalid request content-type header (must be "application/x-www-form-urlencoded").');
    }

    var grantType = req.body.grant_type;
    var codeRaw;

    if (grantType === 'authorization_code') {
        codeRaw = req.body.code;
    } else if (grantType === 'refresh_token') {
        codeRaw = req.body.refresh_token;
    }

    try {
        var code = jwt.verify(codeRaw, config.jwtSecret);
    } catch (e) {
        return res.status(401).send(`Invalid token: ${e.message}`);
    }


    if (code.scope.indexOf('offline_access') >= 0) {
        code.context['refresh_token'] = jwt.sign(code, config.jwtSecret);
    }

    if (code.auth_error == "token_invalid_token") {
        return res.status(401).send("Invalid token: simulated invalid token error");
    }

    var token = Object.assign({}, code.context, {
        token_type: "bearer",
        expires_in: 3600,
        scope: code.scope,
        client_id: req.body.client_id
    });
    
    if (code.auth_error == "request_invalid_token") {
        token.sim_error = "Invalid token";
    } else if (code.auth_error == "request_expired_token") {
        token.sim_error = "Token expired";
    }

    if (code.user && code.scope.indexOf("profile") && code.scope.indexOf("openid")) {
        token.id_token = jwt.sign({
            profile: "Practitioner/" + code.user,
            aud: req.body.client_id,
            iss: config.baseUrl
        }, config.oidcKeypair.d, config.oidcKeypair.alg);
    }

    // console.log(JSON.stringify(token, null, 2));

    token.access_token = jwt.sign(token, config.jwtSecret, { expiresIn: "1h" });
    res.json(token);
});
