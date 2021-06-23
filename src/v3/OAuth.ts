import { Request, Response } from "express"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import * as config from "../config"
import { OAuthError } from "../lib";
import * as errors from "../errors"
import ScopeSet from "./ScopeSet"

// Begin type definitions ------------------------------------------------------

type LaunchType = "ehr" | "patient-standalone" | "provider-standalone" | "cds-hooks"

type AuthorizeRequest = Request<any, any, any, AuthorizeParams, any>

type TokenRequest = RefreshTokenRequest | ClientCredentialsTokenRequest | AuthorizationCodeTokenRequest

type RefreshTokenRequest = Request<any, RefreshTokenResponse | typeof OAuthError, RefreshTokenRequestBody, any, any>

type ClientCredentialsTokenRequest = Request<any, ClientCredentialsTokenResponse | typeof OAuthError, ClientCredentialsTokenRequestBody, any, any>

type AuthorizationCodeTokenRequest = Request<any, AccessTokenResponse | typeof OAuthError, AuthorizationCodeTokenRequestBody, any, any>

interface TokenRequestBody
{
    grant_type: "client_credentials" | "authorization_code" | "refresh_token"
}

interface RefreshTokenRequestBody extends TokenRequestBody
{
    grant_type: "refresh_token"
    refresh_token: string
    scope?: string
}

interface ClientCredentialsTokenRequestBody extends TokenRequestBody
{
    grant_type: "client_credentials"
    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
    client_assertion: string
    scope: string
}

interface AuthorizationCodeTokenRequestBody extends TokenRequestBody
{
    grant_type: "authorization_code"
    code: string
    redirect_uri: string

    /**
     * Required for public apps. Omit for confidential apps.
     */
    client_id?: string
}

interface AccessTokenResponse extends LaunchContext
{
    token_type: "bearer"
    access_token: string
    scope: string
    expires_in?: number
    refresh_token?: string
    id_token?: string
}

interface RefreshTokenResponse extends LaunchContext
{
    token_type: "bearer"
    access_token: string
    scope: string
    expires_in: number
    refresh_token?: string
}

interface ClientCredentialsTokenResponse
{
    token_type: "bearer"
    access_token: string
    expires_in: number
    scope: string
}

/**
 * Once an app is authorized, the token response will include any context data
 * the app requested – along with (potentially!) any unsolicited context data
 * the EHR decides to communicate. For example, EHRs may use launch context to
 * communicate UX and UI expectations to the app (see need_patient_banner below).
 * 
 * Launch context parameters come alongside the access token. They will appear
 * as JSON parameters.
 */
interface LaunchContext
{
    /**
     * Pre-selected user. If not set and user-level scopes are requested, then
     * an user login dialog will be rendered during authorization.
     */
    user?: string

    /**
     * String value with a patient id, indicating that the app was launched in
     * the context of FHIR Patient 123. If the app has any patient-level scopes,
     * they will be scoped to Patient 123.
     */
    patient?: string

    /**
     * value with an encounter id, indicating that the app was launched in the
     * context of that FHIR Encounter.
     */
    encounter?: string

    /**
     * Boolean value indicating whether the app was launched in a UX context
     * where a patient banner is required (when true) or not required (when
     * false). An app receiving a value of false should not take up screen real
     * estate displaying a patient banner.
     */
    need_patient_banner?: boolean

    /**
     * String value describing the intent of the application launch.
     * Some SMART apps might offer more than one context or user interface that
     * can be accessed during the SMART launch. The optional intent parameter in
     * the launch context provides a mechanism for the SMART host to communicate
     * to the client app which specific context should be displayed as the
     * outcome of the launch. This allows for closer integration between the
     * host and client, so that different launch points in the host UI can
     * target specific displays within the client app.
     * 
     * For example, a patient timeline app might provide three specific UI
     * contexts, and inform the SMART host (out of band, at app configuration
     * time) of the intent values that can be used to launch the app directly
     * into one of the three contexts. The app might respond to intent values
     * like:
     * - "summary-timeline-view" - A default UI context, showing a data summary
     * - "recent-history-timeline" - A history display, showing a list of entries
     * - "encounter-focused-timeline" - A timeline focused on the currently in-context encounter
     * 
     * If a SMART host provides a value that the client does not recognize, or
     * does not provide a value, the client app should display a default
     * application UI context.
     * 
     * Note: SMART makes no effort to standardize intent values. Intents simply
     * provide a mechanism for tighter custom integration between an app and a
     * SMART host. The meaning of intents must be negotiated between the app and
     * the host.
     */
    intent?: string

    /**
     * String URL where the host’s style parameters can be retrieved (for apps
     * that support styling)
     */
    smart_style_url?: string

    /**
     * An error to simulate
     */
    error?: string
}

/**
 * A  SMART/OAuth 2.0 IDToken
 * See https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 */
interface IDToken {
    
    /**
     * Some EHRs may use the profile claim as an alias for fhirUser, and to
     * preserve compatibility, these EHRs should continue to support this claim
     * during a deprecation phase.
     * @deprecated
     * @alias fhirUser
     */
    profile: string

    /**
     * The EHR SHALL support the inclusion of SMART’s fhirUser claim within the
     * id_token issued for any requests that grant the openid and fhirUser
     * scopes.
     * @alias profile
     */
    fhirUser: string

    /**
     * Audience(s) that this ID Token is intended for. It MUST contain the
     * OAuth 2.0 client_id of the Relying Party as an audience value. It MAY
     * also contain identifiers for other audiences. In the general case,
     * the aud value is an array of case sensitive strings. In the common
     * special case when there is one audience, the aud value MAY be a single
     * case sensitive string.
     */
    aud: string

    /**
     * Subject Identifier. A locally unique and never reassigned identifier
     * within the Issuer for the End-User, which is intended to be consumed by
     * the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
     * It MUST NOT exceed 255 ASCII characters in length. The sub value is a
     * case sensitive string.
     */
    sub: string

    /**
     * Issuer Identifier for the Issuer of the response. The iss value is a case
     * sensitive URL using the https scheme that contains scheme, host, and
     * optionally, port number and path components and no query or fragment
     * components.
     */
    iss: string
 
    /**
     * Expiration time on or after which the ID Token MUST NOT be accepted for
     * processing. The processing of this parameter requires that the current
     * date/time MUST be before the expiration date/time listed in the value.
     * Implementers MAY provide for some small leeway, usually no more than a
     * few minutes, to account for clock skew. Its value is a JSON number
     * representing the number of seconds from 1970-01-01T0:0:0Z as measured
     * in UTC until the date/time. See RFC 3339 [RFC3339] for details regarding
     * date/times in general and UTC in particular.
     */
    exp: number

    /**
     * Time at which the JWT was issued. Its value is a JSON number representing
     * the number of seconds from 1970-01-01T0:0:0Z as measured in UTC until the
     * date/time.
     */
    iat: number

    /**
     * String value used to associate a Client session with an ID Token, and to
     * mitigate replay attacks. The value is passed through unmodified from the
     * Authentication Request to the ID Token. If present in the ID Token,
     * Clients MUST verify that the nonce Claim Value is equal to the value of
     * the nonce parameter sent in the Authentication Request. If present in the
     * Authentication Request, Authorization Servers MUST include a nonce Claim
     * in the ID Token with the Claim Value being the nonce value sent in the
     * Authentication Request. Authorization Servers SHOULD perform no other
     * processing on nonce values used. The nonce value is a case sensitive
     * string.
     */
    nonce?: string

    /**
     * ID Tokens MAY contain other Claims. Any Claims used that are not
     * understood MUST be ignored.
     */
    [key: string]: any
}

interface CodeToken
{
    /**
     * The app redirect_uri
     */
    redirect_uri: string

    /**
     * Requested scopes
     */
    scope: string

    /**
     * Simulated error id
     */
    error?: string

    /**
     * Selected user ID (if any)
     */
    user?: string

    client_id: string
    nonce?: string
}

/**
 * These are the query string parameters that can be passed to the authorize
 * endpoint. Note that in addition to the standard parameters defined by
 * SMART/OAuth, we also accept some additional ones like: patient, user,
 * encounter, error... These are used internally (for example to pass in the
 * selection from a patient picker), but can also be used by developers for
 * testing.
 */
interface AuthorizeParams
{
    response_type: "code"
    redirect_uri: string
    client_id: string
    scope: string
    aud: string
    launch?: string
    state?: string

    /**
     * ID of the selected patient (passed in from the patient picker)
     */
    patient?: string

    /**
     * ID of the selected user (passed in from the user picker)
     */
    user?: string
 
    /**
     * ID of the selected encounter (passed in from the encounter picker)
     */
    encounter?: string

    /**
     * Simulated error id
     */
    error?: string
}

interface LaunchState
{
    launchType: LaunchType
    scope: ScopeSet
    patient?: string
    encounter?: string
    user?: string

    /**
     * Skip the login screen (only applicable for standalone launches and only
     * if a single user has already been selected)
     */
    skipLogin?: boolean

    /**
     * Skip the launch approval dialog (only applicable for standalone launches)
     */
    skipApproval?: boolean

    selectFirstEncounter?: boolean
}

// End type definitions --------------------------------------------------------

// Begin constants -------------------------------------------------------------
// These are just temporary constants to improve code readability. It should be
// possible to compute URLs dynamically later...
const PROTOCOL             = "http:"
const SERVER_BASE_URL      = PROTOCOL + "//localhost:8443/v/r4"
const FHIR_SERVER_URL      = SERVER_BASE_URL + "/fhir"
const PATIENT_PICKER_URL   = SERVER_BASE_URL + "/select-patient"
const ENCOUNTER_PICKER_URL = SERVER_BASE_URL + "/select-encounter"
const PATIENT_LOGIN_URL    = PROTOCOL + "//localhost:8443/v3/login"
const PROVIDER_LOGIN_URL   = PROTOCOL + "//localhost:8443/v3/login-as-provider"
const APPROVE_LAUNCH_URL   = SERVER_BASE_URL + "/approve-launch"
// End constants ---------------------------------------------------------------

/**
 * Decide if a patients needs top log in. Should only return true if all of the
 * following is true:
 * - This is a patient standalone launch
 * - No patient has been selected (or we have a multiple selection)
 * - No skipLogin flag has been set
 */
function needToLoginAsPatient(state: LaunchState): boolean
{
    if (state.launchType !== "patient-standalone") {
        return false;
    }

    if (!state.patient || state.patient.indexOf(",") > -1) {
        return true;
    }

    return state.skipLogin === false;
}

function needToLoginAsProvider(state: LaunchState): boolean
{
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

function needToSelectPatient(state: LaunchState): boolean
{
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

function needToSelectEncounter(state: LaunchState): boolean
{
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

function needToApproveLaunch(state: LaunchState): boolean
{
    if (state.skipApproval) {
        return false;
    } 
    return state.launchType === "provider-standalone" || state.launchType === "patient-standalone";
}

function getAuthorizeParams(req: AuthorizeRequest): AuthorizeParams
{
    const params: Partial<AuthorizeParams> = {};

    // state
    // -------------------------------------------------------------------------
    const state = String(req.query.state || "").trim();
    if (state) {
        params.state = state;
    }

    // redirect_uri
    // -------------------------------------------------------------------------
    try {
        const redirectUrl = new URL(String(req.query.redirect_uri || "").trim());
        params.redirect_uri = redirectUrl.href;
    } catch (ex) {
        throw new OAuthError(400, `Invalid or missing redirect_uri parameter. ${ex.message}`, "invalid_request")
    }

    // The "aud" param must match the apiUrl (but can have different protocol)
    // -------------------------------------------------------------------------
    let a = String(req.query.aud || "").replace(/^https?/, "").replace(/^:\/\/localhost/, "://127.0.0.1");
    let b = FHIR_SERVER_URL.replace(/^https?/, "").replace(/^:\/\/localhost/, "://127.0.0.1");
    if (a != b) {
        throw new OAuthError(302, "Bad audience value", "invalid_request")
    }
    params.aud = req.query.aud;

    // client_id: string
    // -------------------------------------------------------------------------
    const client_id = String(req.query.client_id || "").trim();
    if (!client_id) {
        throw new OAuthError(400, "Missing client_id parameter", "invalid_request")
    }
    params.client_id = client_id;
    
    // scope: string
    // -------------------------------------------------------------------------
    const scope = String(req.query.scope || "").trim();
    if (!scope) {
        throw new OAuthError(400, "Missing scope parameter", "invalid_request")
    }
    params.scope = scope;
    
    // response_type: "code"
    // -------------------------------------------------------------------------
    const response_type = String(req.query.response_type || "").trim();
    if (response_type !== "code") {
        throw new OAuthError(400, "Invalid or missing response_type parameter", "invalid_request")
    }
    params.response_type = "code"

    // launch?: string
    // -------------------------------------------------------------------------
    if (req.query.launch) params.launch = req.query.launch;

    // patient?: string
    // -------------------------------------------------------------------------
    if (req.query.patient) params.patient = req.query.patient;

    // user?: string
    // -------------------------------------------------------------------------
    if (req.query.user) params.user = req.query.user;

    // encounter?: string
    // -------------------------------------------------------------------------
    if (req.query.encounter) params.encounter = req.query.encounter;

    // error?: string
    // -------------------------------------------------------------------------
    if (req.query.error) params.error = req.query.error;

    return params as AuthorizeParams;
}

function getLaunchType(params: AuthorizeParams): LaunchType
{
    if (params.launch) {
        return "ehr"
    }

    if ("user" in params) {
        return "provider-standalone"
    }

    return "patient-standalone"
}

function redirect(res: Response, path: string, query: Record<string, any>)
{
    const search = new URLSearchParams()
    for (const name in query) {
        if (query[name] !== undefined) {
            search.set(name, query[name])
        }
    }
    res.redirect(path + "?" + search)
}

/**
 * Launches an app, optionally passing some pre-selected context
 * @param req 
 * @param res 
 */
export function launch(req: Request, res: Response)
{
    const launch_uri = String(req.query.launch_uri || "").trim();
    if (!launch_uri) {
        return res.status(400).send("launch_uri parameter is required");
    }
    
    // Encapsulate the client and launch info in a JWT and use it as
    // launch param
    const launchParams: LaunchContext = {
        patient  : String(req.query.patient   || ""),
        user     : String(req.query.user      || ""),
        encounter: String(req.query.encounter || ""),
        error    : String(req.query.error     || ""),
    }

    // Build the iss url
    const issUrl = new URL(req.baseUrl.replace(/\/auth\/.+/, "/fhir"), config.baseUrl)

    // Build the redirect url
    const redirectUrl = new URL(launch_uri);
    redirectUrl.protocol = issUrl.protocol;
    redirectUrl.searchParams.set("iss", issUrl.href);
    redirectUrl.searchParams.set("launch", jwt.sign(launchParams, config.jwtSecret));

    // redirect
    res.redirect(redirectUrl.href);
}

/**
 * 
 * @param req 
 * @param res 
 */
export function authorize(req: AuthorizeRequest, res: Response)
{
    const params = getAuthorizeParams(req);

    const state: LaunchState = {
        launchType: getLaunchType(params),
        scope: new ScopeSet(params.scope),
    }

    if (params.patient  ) state.patient   = params.patient;
    if (params.encounter) state.encounter = params.encounter;
    if (params.user     ) state.user      = params.user;

    // User decided not to authorize the app launch
    if (params.error == "launch_rejected") {
        throw OAuthError.from(errors.authorization_code.unauthorized)
    }

    // Simulate auth_invalid_client_id error if requested
    if (params.error == "auth_invalid_client_id") {
        throw OAuthError.from(errors.authorization_code.sim_invalid_client_id)
    }

    // Simulate auth_invalid_redirect_uri error if requested
    if (params.error == "auth_invalid_redirect_uri") {
        throw OAuthError.from(errors.authorization_code.sim_invalid_redirect_uri)
    }

    // Simulate auth_invalid_scope error if requested
    if (params.error == "auth_invalid_scope") {
        throw OAuthError.from(errors.authorization_code.sim_invalid_scope)
    }
    
    // PATIENT LOGIN SCREEN
    if (needToLoginAsPatient(state)) {
        return redirect(res, PATIENT_LOGIN_URL, { ...req.query, patient: state.patient });
    }
    
    // PROVIDER LOGIN SCREEN
    if (needToLoginAsProvider(state)) {
        return redirect(res, PROVIDER_LOGIN_URL, { ...req.query, provider: state.user });
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
    const codeToken: CodeToken = {
        redirect_uri: params.redirect_uri,
        scope       : params.scope,
        client_id   : params.client_id
    }

    // LAUNCH!
    const redirectUrl = new URL(params.redirect_uri)
    redirectUrl.searchParams.set("code", jwt.sign(codeToken, config.jwtSecret));
    if (params.state) {
        redirectUrl.searchParams.set("state", params.state);
    }
    res.redirect(redirectUrl.href);
}

function getAccessTokenFromAuthorizationCode(req: AuthorizationCodeTokenRequest, res: Response)
{
    // validate req.body
    const codeToken = verifyToken<CodeToken>(req.body.code)

    // redirect_uri must be included in the code token
    if (!codeToken.redirect_uri) {
        throw new OAuthError(400, "Invalid code parameter", "invalid_request")
    }

    // redirect_uri must be included in the body
    if (!req.body.redirect_uri) {
        throw new OAuthError(400, "Missing redirect_uri parameter", "invalid_request")
    }

    // codeToken.redirect_uri but equal body.redirect_uri
    if (req.body.redirect_uri !== codeToken.redirect_uri) {
        throw new OAuthError(401, "Invalid redirect_uri parameter", "invalid_request")
    }

    // handle simulated errors
    if (codeToken.error === "invalid_code") {
        throw new OAuthError(400, "Simulated invalid code parameter", "invalid_request")
    }

    const scope = new ScopeSet(decodeURIComponent(codeToken.scope));

    const accessToken = ""

    // build AccessTokenResponse
    const response: AccessTokenResponse = {
        token_type  : "bearer",
        access_token: jwt.sign(accessToken, config.jwtSecret),
        scope       : negotiateScopes(codeToken.scope)
    }

    // id_token
    if (codeToken.user && scope.has("openid") && (scope.has("profile") || scope.has("fhirUser"))) {
        response.id_token = jwt.sign(createIdToken(req, codeToken), config.jwtSecret);
    }

    // refresh_token
    if (scope.has('offline_access') || scope.has('online_access')) {
        response.refresh_token = jwt.sign(
            crypto.randomBytes(16).toString("hex"),
            config.jwtSecret,
            { expiresIn: +config.refreshTokenLifeTime * 60 }
        );
    }

    // Reply with AccessTokenResponse
    res.set({ "cache-control": "no-store", pragma: "no-cache" }).json(response);
}

function getAccessTokenFromClientAssertion(req: ClientCredentialsTokenRequest, res: Response<AccessTokenResponse, any>)
{
    // validate req.body
    // handle simulated errors

    const accessToken = ""

    // build ClientCredentialsTokenResponse
    const response: AccessTokenResponse = {
        token_type: "bearer",
        access_token: jwt.sign(accessToken, config.jwtSecret),
        scope: ""
    }
    
    // Reply with ClientCredentialsTokenResponse
    res.set({ "cache-control": "no-store", pragma: "no-cache" }).json(response);
}

function getRefreshToken(req: RefreshTokenRequest, res: Response<RefreshTokenResponse, any>)
{
    // validate req.body.refresh_token
    jwt.verify(req.body.refresh_token, config.jwtSecret)

    // handle "token_expired_refresh_token" errors

    const accessToken = ""

    // build RefreshTokenResponse
    const response: RefreshTokenResponse = {
        token_type: "bearer",
        access_token: jwt.sign(accessToken, config.jwtSecret),
        expires_in: 300,
        scope: ""
    }

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
export function getToken(req: TokenRequest, res: Response)
{
    if (!req.is("application/x-www-form-urlencoded")) {
        throw OAuthError.from(errors.form_content_type_required)
    }

    switch (req.body.grant_type) {
        case "client_credentials":
            getAccessTokenFromClientAssertion(req as ClientCredentialsTokenRequest, res);
        break;
        case "authorization_code":
            getAccessTokenFromAuthorizationCode(req as AuthorizationCodeTokenRequest, res);
        break;
        case "refresh_token":
            getRefreshToken(req as RefreshTokenRequest, res);
        break;
        default:
            throw OAuthError.from(errors.bad_grant_type, (req.body as any).grant_type);
    }
}

/**
 * @param token The JWT string to be verified and parsed
 */
function verifyToken<T=Record<string, any>>(token: string): T
{
    return <unknown>jwt.verify(token, config.jwtSecret) as T
}

/**
 * Returns the ISS url.
 * NOTE that this function assumes that it is being called within a router and
 * the `baseUrl` property of the request (the router's mount point) is the ISS!
 */
function getISS(req: Request)
{
    const secure = req.secure || req.headers["x-forwarded-proto"] == "https";
    const iss = new URL(req.baseUrl, config.baseUrl);
    iss.protocol = secure ? "https:" : "http:"
    return iss.href;
}

/**
 * Generates the id token that is included in the token response if needed.
 * This function is only used when an access token is requested and if an user
 * has already been selected.
 */
function createIdToken(req: Request, codeToken: CodeToken): IDToken
{
    // this function should only be called if the codeToken has an user,
    // but lets verify that anyway
    if (!codeToken.user) {
        throw new OAuthError(400, "Invalid code parameter", "invalid_request")
    }

    let payload: IDToken = {
        profile : codeToken.user,
        fhirUser: codeToken.user,
        aud: codeToken.client_id,
        sub: crypto.createHash('sha256').update(codeToken.user).digest('hex'),
        exp: 0,
        iat: 0,
        iss: getISS(req)
    };

    // Reflect back the nonce if it was provided in the original Authentication
    // Request.
    let { nonce } = codeToken;
    if (nonce) {
        payload.nonce = nonce;
    }

    return payload;
}

/**
 * Currently we grant whatever scope is requested. This is just a placeholder
 * in case we need to do scope negotiation.
 */
function negotiateScopes(requestedScopes: string)
{
    return requestedScopes;
}
