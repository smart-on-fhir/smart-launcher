"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var crypto_1 = require("crypto");
var jsonwebtoken_1 = require("jsonwebtoken");
var config = require("../config");
var lib_1 = require("../lib");
var errors = require("../errors");
var ScopeSet_1 = require("./ScopeSet");
// End type definitions --------------------------------------------------------
// Begin constants -------------------------------------------------------------
// These are just temporary constants to improve code readability. It should be
// possible to compute URLs dynamically later...
var PROTOCOL = "http:";
var SERVER_BASE_URL = PROTOCOL + "//localhost:8443/v/r4";
var FHIR_SERVER_URL = SERVER_BASE_URL + "/fhir";
var PATIENT_PICKER_URL = SERVER_BASE_URL + "/select-patient";
var ENCOUNTER_PICKER_URL = SERVER_BASE_URL + "/select-encounter";
var PATIENT_LOGIN_URL = PROTOCOL + "//localhost:8443/v3/login";
var PROVIDER_LOGIN_URL = PROTOCOL + "//localhost:8443/v3/login-as-provider";
var APPROVE_LAUNCH_URL = SERVER_BASE_URL + "/approve-launch";
// End constants ---------------------------------------------------------------
/**
 * Decide if a patients needs top log in. Should only return true if all of the
 * following is true:
 * - This is a patient standalone launch
 * - No patient has been selected (or we have a multiple selection)
 * - No skipLogin flag has been set
 */
function needToLoginAsPatient(state) {
    if (state.launchType !== "patient-standalone") {
        return false;
    }
    if (!state.patient || state.patient.indexOf(",") > -1) {
        return true;
    }
    return state.skipLogin === false;
}
function needToLoginAsProvider(state) {
    // In patient-standalone launch the patient is the user
    if (state.launchType === "patient-standalone") {
        return false;
    }
    // Require both "openid" and "profile|fhirUser" scopes
    if (!(state.scope.has("openid") && (state.scope.has("profile") || state.scope.has("fhirUser")))) {
        return false;
    }
    // EHR or Provider launch + openid and profile scopes + no provider selected
    if (!state.user) {
        return true;
    }
    // If single provider is selected show login if skip_login is not set
    if (state.user.indexOf(",") < 0) {
        return state.launchType == "ehr" ? false : !state.skipLogin;
    }
    return true;
}
function needToSelectPatient(state) {
    // No - if already have one patient selected
    if (state.patient && state.patient.indexOf(",") == -1) {
        return false;
    }
    // Yes - if 0 or multiple patients selected and provider launch and launch/patient scope
    if (state.launchType == "provider-standalone" && state.scope.has("launch/patient")) {
        return true;
    }
    // Yes - if 0 or multiple patients selected and ehr launch and launch/patient or launch scope
    if (state.launchType == "ehr" && (state.scope.has("launch/patient") || state.scope.has("launch"))) {
        return true;
    }
    // Yes - if 0 or multiple patients selected and CDS launch and launch/patient or launch scope
    if (state.launchType == "cds-hooks" && (state.scope.has("launch/patient") || state.scope.has("launch"))) {
        return true;
    }
    // No by default
    return false;
}
function needToSelectEncounter(state) {
    // Already selected
    if (state.encounter) {
        return false;
    }
    // Not possible without a patient
    if (!state.patient) {
        return false;
    }
    // N/A to standalone launches unless configured otherwise
    if (state.launchType !== "ehr" && !config.includeEncounterContextInStandaloneLaunch) {
        return false;
    }
    // Only if launch or launch/encounter scope is requested
    return state.scope.has("launch") || state.scope.has("launch/encounter");
}
function needToApproveLaunch(state) {
    if (state.skipApproval) {
        return false;
    }
    return state.launchType === "provider-standalone" || state.launchType === "patient-standalone";
}
function getAuthorizeParams(req) {
    var params = {};
    // state
    // -------------------------------------------------------------------------
    var state = String(req.query.state || "").trim();
    if (state) {
        params.state = state;
    }
    // redirect_uri
    // -------------------------------------------------------------------------
    try {
        var redirectUrl = new URL(String(req.query.redirect_uri || "").trim());
        params.redirect_uri = redirectUrl.href;
    }
    catch (ex) {
        throw new lib_1.OAuthError(400, "Invalid or missing redirect_uri parameter. " + ex.message, "invalid_request");
    }
    // The "aud" param must match the apiUrl (but can have different protocol)
    // -------------------------------------------------------------------------
    var a = String(req.query.aud || "").replace(/^https?/, "").replace(/^:\/\/localhost/, "://127.0.0.1");
    var b = FHIR_SERVER_URL.replace(/^https?/, "").replace(/^:\/\/localhost/, "://127.0.0.1");
    if (a != b) {
        throw new lib_1.OAuthError(302, "Bad audience value", "invalid_request");
    }
    params.aud = req.query.aud;
    // client_id: string
    // -------------------------------------------------------------------------
    var client_id = String(req.query.client_id || "").trim();
    if (!client_id) {
        throw new lib_1.OAuthError(400, "Missing client_id parameter", "invalid_request");
    }
    params.client_id = client_id;
    // scope: string
    // -------------------------------------------------------------------------
    var scope = String(req.query.scope || "").trim();
    if (!scope) {
        throw new lib_1.OAuthError(400, "Missing scope parameter", "invalid_request");
    }
    params.scope = scope;
    // response_type: "code"
    // -------------------------------------------------------------------------
    var response_type = String(req.query.response_type || "").trim();
    if (response_type !== "code") {
        throw new lib_1.OAuthError(400, "Invalid or missing response_type parameter", "invalid_request");
    }
    params.response_type = "code";
    // launch?: string
    // -------------------------------------------------------------------------
    if (req.query.launch)
        params.launch = req.query.launch;
    // patient?: string
    // -------------------------------------------------------------------------
    if (req.query.patient)
        params.patient = req.query.patient;
    // user?: string
    // -------------------------------------------------------------------------
    if (req.query.user)
        params.user = req.query.user;
    // encounter?: string
    // -------------------------------------------------------------------------
    if (req.query.encounter)
        params.encounter = req.query.encounter;
    // error?: string
    // -------------------------------------------------------------------------
    if (req.query.error)
        params.error = req.query.error;
    return params;
}
function getLaunchType(params) {
    if (params.launch) {
        return "ehr";
    }
    if ("user" in params) {
        return "provider-standalone";
    }
    return "patient-standalone";
}
function redirect(res, path, query) {
    var search = new URLSearchParams();
    for (var name_1 in query) {
        if (query[name_1] !== undefined) {
            search.set(name_1, query[name_1]);
        }
    }
    res.redirect(path + "?" + search);
}
/**
 * Launches an app, optionally passing some pre-selected context
 * @param req
 * @param res
 */
function launch(req, res) {
    var launch_uri = String(req.query.launch_uri || "").trim();
    if (!launch_uri) {
        return res.status(400).send("launch_uri parameter is required");
    }
    // Encapsulate the client and launch info in a JWT and use it as
    // launch param
    var launchParams = {
        patient: String(req.query.patient || ""),
        user: String(req.query.user || ""),
        encounter: String(req.query.encounter || ""),
        error: String(req.query.error || "")
    };
    // Build the iss url
    var issUrl = new URL(req.baseUrl.replace(/\/auth\/.+/, "/fhir"), config.baseUrl);
    // Build the redirect url
    var redirectUrl = new URL(launch_uri);
    redirectUrl.protocol = issUrl.protocol;
    redirectUrl.searchParams.set("iss", issUrl.href);
    redirectUrl.searchParams.set("launch", jsonwebtoken_1["default"].sign(launchParams, config.jwtSecret));
    // redirect
    res.redirect(redirectUrl.href);
}
exports.launch = launch;
/**
 *
 * @param req
 * @param res
 */
function authorize(req, res) {
    var params = getAuthorizeParams(req);
    var state = {
        launchType: getLaunchType(params),
        scope: new ScopeSet_1["default"](params.scope)
    };
    if (params.patient)
        state.patient = params.patient;
    if (params.encounter)
        state.encounter = params.encounter;
    if (params.user)
        state.user = params.user;
    // User decided not to authorize the app launch
    if (params.error == "launch_rejected") {
        throw lib_1.OAuthError.from(errors.authorization_code.unauthorized);
    }
    // Simulate auth_invalid_client_id error if requested
    if (params.error == "auth_invalid_client_id") {
        throw lib_1.OAuthError.from(errors.authorization_code.sim_invalid_client_id);
    }
    // Simulate auth_invalid_redirect_uri error if requested
    if (params.error == "auth_invalid_redirect_uri") {
        throw lib_1.OAuthError.from(errors.authorization_code.sim_invalid_redirect_uri);
    }
    // Simulate auth_invalid_scope error if requested
    if (params.error == "auth_invalid_scope") {
        throw lib_1.OAuthError.from(errors.authorization_code.sim_invalid_scope);
    }
    // PATIENT LOGIN SCREEN
    if (needToLoginAsPatient(state)) {
        return redirect(res, PATIENT_LOGIN_URL, __assign({}, req.query, { patient: state.patient }));
    }
    // PROVIDER LOGIN SCREEN
    if (needToLoginAsProvider(state)) {
        return redirect(res, PROVIDER_LOGIN_URL, __assign({}, req.query, { provider: state.user }));
    }
    // PATIENT PICKER
    if (needToSelectPatient(state)) {
        return redirect(res, PATIENT_PICKER_URL, { patient: state.patient });
    }
    // ENCOUNTER
    if (needToSelectEncounter(state)) {
        return redirect(res, ENCOUNTER_PICKER_URL, { patient: state.patient, select_first: state.selectFirstEncounter });
    }
    // AUTH SCREEN
    if (needToApproveLaunch(state)) {
        return redirect(res, APPROVE_LAUNCH_URL, { patient: state.patient });
    }
    // CREATE CODE TOKEN
    var codeToken = {
        redirect_uri: params.redirect_uri,
        scope: params.scope,
        client_id: params.client_id
    };
    // LAUNCH!
    var redirectUrl = new URL(params.redirect_uri);
    redirectUrl.searchParams.set("code", jsonwebtoken_1["default"].sign(codeToken, config.jwtSecret));
    if (params.state) {
        redirectUrl.searchParams.set("state", params.state);
    }
    res.redirect(redirectUrl.href);
}
exports.authorize = authorize;
function getAccessTokenFromAuthorizationCode(req, res) {
    // validate req.body
    var codeToken = verifyToken(req.body.code);
    // redirect_uri must be included in the code token
    if (!codeToken.redirect_uri) {
        throw new lib_1.OAuthError(400, "Invalid code parameter", "invalid_request");
    }
    // redirect_uri must be included in the body
    if (!req.body.redirect_uri) {
        throw new lib_1.OAuthError(400, "Missing redirect_uri parameter", "invalid_request");
    }
    // codeToken.redirect_uri but equal body.redirect_uri
    if (req.body.redirect_uri !== codeToken.redirect_uri) {
        throw new lib_1.OAuthError(401, "Invalid redirect_uri parameter", "invalid_request");
    }
    // handle simulated errors
    if (codeToken.error === "invalid_code") {
        throw new lib_1.OAuthError(400, "Simulated invalid code parameter", "invalid_request");
    }
    var scope = new ScopeSet_1["default"](decodeURIComponent(codeToken.scope));
    var accessToken = "";
    // build AccessTokenResponse
    var response = {
        token_type: "bearer",
        access_token: jsonwebtoken_1["default"].sign(accessToken, config.jwtSecret),
        scope: negotiateScopes(codeToken.scope)
    };
    // id_token
    if (codeToken.user && scope.has("openid") && (scope.has("profile") || scope.has("fhirUser"))) {
        response.id_token = jsonwebtoken_1["default"].sign(createIdToken(req, codeToken), config.jwtSecret);
    }
    // refresh_token
    if (scope.has('offline_access') || scope.has('online_access')) {
        response.refresh_token = jsonwebtoken_1["default"].sign(crypto_1["default"].randomBytes(16).toString("hex"), config.jwtSecret, { expiresIn: +config.refreshTokenLifeTime * 60 });
    }
    // Reply with AccessTokenResponse
    res.set({ "cache-control": "no-store", pragma: "no-cache" }).json(response);
}
function getAccessTokenFromClientAssertion(req, res) {
    // validate req.body
    // handle simulated errors
    var accessToken = "";
    // build ClientCredentialsTokenResponse
    var response = {
        token_type: "bearer",
        access_token: jsonwebtoken_1["default"].sign(accessToken, config.jwtSecret),
        scope: ""
    };
    // Reply with ClientCredentialsTokenResponse
    res.set({ "cache-control": "no-store", pragma: "no-cache" }).json(response);
}
function getRefreshToken(req, res) {
    // validate req.body.refresh_token
    jsonwebtoken_1["default"].verify(req.body.refresh_token, config.jwtSecret);
    // handle "token_expired_refresh_token" errors
    var accessToken = "";
    // build RefreshTokenResponse
    var response = {
        token_type: "bearer",
        access_token: jsonwebtoken_1["default"].sign(accessToken, config.jwtSecret),
        expires_in: 300,
        scope: ""
    };
    // Reply with RefreshTokenResponse
    res.set({ "cache-control": "no-store", pragma: "no-cache" }).json(response);
}
/**
 * Handler for POST requests to the token endpoint. This endpoint is used to
 * issue access tokens for SMART apps or Backend services clients, as well as
 * refresh tokens for SMART apps. The requests must include a "grant_type"
 * parameter in the body, which is used to determine the further behavior of
 * the flow.
 * @param req POST request with application/x-www-form-urlencoded content type
 * @param res
 */
function getToken(req, res) {
    if (!req.is("application/x-www-form-urlencoded")) {
        throw lib_1.OAuthError.from(errors.form_content_type_required);
    }
    switch (req.body.grant_type) {
        case "client_credentials":
            getAccessTokenFromClientAssertion(req, res);
            break;
        case "authorization_code":
            getAccessTokenFromAuthorizationCode(req, res);
            break;
        case "refresh_token":
            getRefreshToken(req, res);
            break;
        default:
            throw lib_1.OAuthError.from(errors.bad_grant_type, req.body.grant_type);
    }
}
exports.getToken = getToken;
/**
 * @param token The JWT string to be verified and parsed
 */
function verifyToken(token) {
    return jsonwebtoken_1["default"].verify(token, config.jwtSecret);
}
/**
 * Returns the ISS url.
 * NOTE that this function assumes that it is being called within a router and
 * the `baseUrl` property of the request (the router's mount point) is the ISS!
 */
function getISS(req) {
    var secure = req.secure || req.headers["x-forwarded-proto"] == "https";
    var iss = new URL(req.baseUrl, config.baseUrl);
    iss.protocol = secure ? "https:" : "http:";
    return iss.href;
}
/**
 * Generates the id token that is included in the token response if needed.
 * This function is only used when an access token is requested and if an user
 * has already been selected.
 */
function createIdToken(req, codeToken) {
    // this function should only be called if the codeToken has an user,
    // but lets verify that anyway
    if (!codeToken.user) {
        throw new lib_1.OAuthError(400, "Invalid code parameter", "invalid_request");
    }
    var payload = {
        profile: codeToken.user,
        fhirUser: codeToken.user,
        aud: codeToken.client_id,
        sub: crypto_1["default"].createHash('sha256').update(codeToken.user).digest('hex'),
        exp: 0,
        iat: 0,
        iss: getISS(req)
    };
    // Reflect back the nonce if it was provided in the original Authentication
    // Request.
    var nonce = codeToken.nonce;
    if (nonce) {
        payload.nonce = nonce;
    }
    return payload;
}
/**
 * Currently we grant whatever scope is requested. This is just a placeholder
 * in case we need to do scope negotiation.
 */
function negotiateScopes(requestedScopes) {
    return requestedScopes;
}
