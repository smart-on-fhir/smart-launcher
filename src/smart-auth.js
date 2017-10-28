// @ts-no-check
const jwt        = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router     = require("express").Router({ mergeParams: true });
const config     = require("./config");
const sandboxify = require("./sandboxify");
const Url        = require("url");
const Lib        = require("./lib");
const jwkToPem   = require("jwk-to-pem");
const base64url  = require("base64-url");
const Codec      = require("../static/codec.js");

const jwkAsPem = jwkToPem(config.oidcKeypair);

module.exports = router;

/**
 * Extracts and returns the sim portion of the URL. If it is missing or invalid,
 * an empty object is returned. NOTE: the "sim" is the "launch" query parameter
 * for EHR launches or an URL segment for standalone launches
 * @param {Object} request
 * @returns {Object}
 */
function getRequestedSIM(request) {
    let sim = {};
    if (request.query.launch || request.params.sim) {
        try {
            sim = Codec.decode(JSON.parse(base64url.decode(
                request.query.launch || request.params.sim
            )));
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

/**
 * Decides if a patient picker needs to be displayed 
 * @param {ScopeSet} scope
 * @param {Object} sim
 * @returns {Boolean}
 */
function needToPickPatient(scope, sim) {

    // If already have one patient selected
    if (sim.patient && sim.patient.indexOf(",") == -1) {
        return false;
    }

    // 0 or multiple patients selected + provider launch + launch/patient scope
    if (sim.launch_prov && scope.has("launch/patient")) {
        return true;
    }

    // 0 or multiple patients selected + EHR launch + patient/... scope
    if (sim.launch_ehr && scope.matches(/\bpatient\//) && scope.matches(/\blaunch\b/)) {
        return true;
    }

    return false;
}

/**
 * Decides if the authorization page needs to be displayed 
 * @param {Object} sim
 * @returns {Boolean}
 */
function needToAuthorize(sim) {
    if (sim.skip_auth) {
        return false;
    } 
    return sim.launch_prov || sim.launch_pt;
}

/**
 * Decides if an encounter picker needs to be displayed 
 * @param {ScopeSet} scope
 * @param {Object} sim
 * @returns {Boolean}
 */
function needToPickEncounter(scope, sim) {

    // Already selected
    if (sim.encounter) {
        return false;
    }

    // Not possible without a patient
    if (!sim.patient) {
        return false;
    }

    // N/A to standalone launches unless configured otherwise
    if (!sim.launch_ehr && !config.includeEncounterContextInStandaloneLaunch) {
        return false;
    }

    // Only if launch or launch/encounter scope is requested
    return scope.has("launch") || scope.has("launch/encounter");
}

/**
 * Decides if a provider login screen needs to be displayed 
 * @param {ScopeSet} scope
 * @param {Object} sim 
 * @returns {Boolean}
 */
function needToLoginAsProvider(scope, sim) {

    // In patient-standalone launch the patient is the user
    if (sim.launch_pt) {
        return false;
    }

    // Require both "openid" and "profile" scopes
    if (!scope.has("openid") || !scope.has("profile")) {
        return false;
    }

    // EHR or Provider launch + openid and profile scopes + no provider selected
    if (!sim.provider) {
        return true;
    }

    // If single provider is selected show login if skip_login is not set
    if (sim.provider.indexOf(",") < 0) {
        return sim.launch_ehr ? false : !sim.skip_login;
    }

    return true;
}

/**
 * Decides if a patient login screen needs to be displayed 
 * @param {Object} sim
 * @returns {Boolean}
 */
function needToLoginAsPatient(sim) {
    if (!sim.launch_pt) {
        return false;
    }

    if (!sim.patient || sim.patient.indexOf(",") > -1) {
        return true;
    }

    return !sim.skip_login;
}

/**
 * Creates and returns the signet JWT code that contains some authorization
 * details.
 * @param {Object} req 
 * @param {Object} sim 
 * @param {ScopeSet} scope 
 * @returns {String}
 */
function createAuthCode(req, sim, scope) {
    let code = {
        context: {
            need_patient_banner: !sim.sim_ehr,
            smart_style_url    : config.baseUrl + "/smart-style.json",
        },
        client_id: req.query.client_id,
        scope    : req.query.scope
    };

    // auth_error
    if (sim.auth_error) {
        code.auth_error = sim.auth_error;
    }

    // patient
    if (sim.patient && sim.patient != "-1") {
        if (scope.has("launch") || scope.has("launch/patient")) {
            code.context.patient = sim.patient;
        }
    }

    // encounter
    if (sim.encounter && sim.encounter != "-1") {
        if (scope.has("launch") || scope.has("launch/encounter")) {
            code.context.encounter = sim.encounter;
        }
    }

    // user
    if (scope.has("openid") && scope.has("profile")) {
        
        // patient as user
        if (sim.launch_pt) {
            if (sim.patient && sim.patient != "-1") {
                code.user = `Patient/${sim.patient}`;
            }
        }

        // provider as user
        else {
            if (sim.provider && sim.provider != "-1") {
                code.user = `Practitioner/${sim.provider}`;
            }
        }
    }

    return jwt.sign(code, config.jwtSecret, { expiresIn: "5m" });
}

/**
 * This class tries to make it easier and cleaner to work with scopes (mostly by
 * using the two major methods - "has" and "matches").
 */
class ScopeSet
{
    constructor(str = "") {
        this._scopesString = String(str).trim();
        this._scopes = this._scopesString.split(/\s+/).filter(Boolean);
    }

    has(scope) {
        return this._scopes.indexOf(scope) > -1;
    }

    matches(scopeRegExp) {
        return this._scopesString.search(scopeRegExp) > -1;
    }

    add(scope) {
        if (this.has(scope)) {
            return false;
        }

        this._scopes.push(scope);
        this._scopesString = this._scopes.join(" ");
        return true;
    }

    remove(scope) {
        let index = this._scopes.indexOf(scope);
        if (index < 0) {
            return false;
        }
        this._scopes.splice(index, 1);
        this._scopesString = this._scopes.join(" ");
        return true;
    }

    toString() {
        return this._scopesString;
    }

    toJSON() {
        return this._scopes;
    }
}


router.get("/authorize", async function (req, res) {

    let sim = getRequestedSIM(req);

    function redirect(to, query = {}) {
        let redirectUrl = Url.parse(req.originalUrl, true);
        redirectUrl.query = Object.assign(redirectUrl.query, query, {
            aud_validated: sim.aud_validated,
            aud          : ""
        });
        redirectUrl.search = null
        redirectUrl.pathname = redirectUrl.pathname.replace(
            config.authBaseUrl + "/authorize",
            to
        );
        return res.redirect(Url.format(redirectUrl));
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
        RedirectURL = Url.parse(decodeURIComponent(req.query.redirect_uri), true);
    } catch (ex) {
        return Lib.replyWithError(res, "bad_redirect_uri", 400, ex.message);
    }

    // Relative redirect_uri like "whatever" will eventually result in wrong
    // URLs like "/auth/whatever". We must only support full http URLs. 
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

    const scopes = new ScopeSet(decodeURIComponent(req.query.scope));

    // PATIENT LOGIN SCREEN
    if (needToLoginAsPatient(sim)) {
        return redirect("/login", { patient: sim.patient, login_type: "patient" });
    }

    // PROVIDER LOGIN SCREEN
    if (needToLoginAsProvider(scopes, sim)) {
        return redirect("/login", { provider: sim.provider, login_type: "provider" });
    }

    // PATIENT PICKER
    if (needToPickPatient(scopes, sim)) {
        return redirect("/picker", { patient: sim.patient });
    }

    // ENCOUNTER
    if (needToPickEncounter(scopes, sim)) {
        return redirect("/encounter", { patient: sim.patient, select_first: sim.select_encounter != "1" });
    }

    // AUTH SCREEN
    if (needToAuthorize(sim)) {
        return redirect("/authorize", { patient: sim.patient });
    }

    // LAUNCH!
    RedirectURL.query.code  = createAuthCode(req, sim, scopes);
    RedirectURL.query.state = req.query.state;
    res.redirect(Url.format(RedirectURL));
});


router.post("/token", bodyParser.urlencoded({ extended: false }), function (req, res) {

    let grantType = req.body.grant_type, codeRaw, code, scopes;
    
    if (req.headers["content-type"].indexOf("application/x-www-form-urlencoded") !== 0) {
        return Lib.replyWithError(res, "form_content_type_required", 401);
    }

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
        expires_in: 3600,
        scope     : code.scope,
        client_id : req.body.client_id
    });

    if (code.auth_error == "request_invalid_token") {
        token.sim_error = "Invalid token";
    } else if (code.auth_error == "request_expired_token") {
        token.sim_error = "Token expired";
    }

    if (code.user && scopes.has("profile") && scopes.has("openid")) {
        token.id_token = jwt.sign({
            profile: code.user,
            aud    : req.body.client_id,
            iss    : config.baseUrl
        },
        jwkAsPem,
        {
            algorithm: "HS256"
        });
    }

    token.access_token = jwt.sign(token, config.jwtSecret, { expiresIn: "1h" });
    res.json(token);
});
