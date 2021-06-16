// @ts-check
const jwt          = require("jsonwebtoken")
const jose         = require("node-jose")
const Url          = require("url")
const util         = require("util")
const ScopeSet     = require("./ScopeSet")
const config       = require("./config")
const Codec        = require("../static/codec.js")
const Lib          = require("./lib")
const SMARTHandler = require("./SMARTHandler")
const errors       = require("./errors")


class AuthorizeHandler extends SMARTHandler {

    static handleRequest(req, res) {
        return new AuthorizeHandler(req, res).handle();
    }

    constructor(req, res) {
        super(req, res);
        this.sim = this.getRequestedSIM();
        this.scope = new ScopeSet(decodeURIComponent(req.query.scope));
        this.nonce = req.query.nonce ? decodeURIComponent(req.query.nonce) : undefined;
    }

    /**
     * Extracts and returns the sim portion of the URL. If it is missing or invalid,
     * an empty object is returned. NOTE: the "sim" is the "launch" query parameter
     * for EHR launches or an URL segment for standalone launches
     * @returns {Object}
     */
    getRequestedSIM() {
        let sim = {}, request = this.request;
        if (request.query.launch || request.params.sim) {
            try {
                sim = Codec.decode(JSON.parse(jose.util.base64url.decode(
                    request.query.launch || request.params.sim
                ).toString("utf8")));
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
     * Decides if a provider login screen needs to be displayed  
     * @returns {Boolean}
     */
    needToLoginAsProvider() {
        
        // In patient-standalone launch the patient is the user
        if (this.sim.launch_pt) {
            return false;
        }
    
        // Require both "openid" and "profile|fhirUser" scopes
        if (!(this.scope.has("openid") && (this.scope.has("profile") || this.scope.has("fhirUser")))) {
            return false;
        }
    
        // EHR or Provider launch + openid and profile scopes + no provider selected
        if (!this.sim.provider) {
            return true;
        }
    
        // If single provider is selected show login if skip_login is not set
        if (this.sim.provider.indexOf(",") < 0) {
            return this.sim.launch_ehr ? false : !this.sim.skip_login;
        }
    
        return true;
    }

    /**
     * Decides if a patient login screen needs to be displayed 
     * @returns {Boolean}
     */
    needToLoginAsPatient() {
        if (!this.sim.launch_pt) {
            return false;
        }

        if (!this.sim.patient || this.sim.patient.indexOf(",") > -1) {
            return true;
        }

        return !this.sim.skip_login;
    }

    /**
     * Decides if an encounter picker needs to be displayed 
     * @returns {Boolean}
     */
    needToPickEncounter() {
    
        // Already selected
        if (this.sim.encounter) {
            return false;
        }
    
        // Not possible without a patient
        if (!this.sim.patient) {
            return false;
        }
    
        // N/A to standalone launches unless configured otherwise
        if (!this.sim.launch_ehr && !config.includeEncounterContextInStandaloneLaunch) {
            return false;
        }
    
        // Only if launch or launch/encounter scope is requested
        return this.scope.has("launch") || this.scope.has("launch/encounter");
    }

    /**
     * Decides if a patient picker needs to be displayed 
     * @returns {Boolean}
     */
    needToPickPatient() {
    
        // No - if already have one patient selected
        if (this.sim.patient && this.sim.patient.indexOf(",") == -1) {
            return false;
        }
    
        // Yes - if 0 or multiple patients selected and provider launch and launch/patient scope
        if (this.sim.launch_prov && this.scope.has("launch/patient")) {
            return true;
        }
    
        // Yes - if 0 or multiple patients selected and ehr launch and launch/patient or launch scope
        if (this.sim.launch_ehr && (this.scope.has("launch/patient") || this.scope.has("launch"))) {
            return true;
        }

        // Yes - if 0 or multiple patients selected and CDS launch and launch/patient or launch scope
        if (this.sim.launch_cds && (this.scope.has("launch/patient") || this.scope.has("launch"))) {
            return true;
        }
    
        // No by default
        return false;
    }

    /**
     * Decides if the authorization page needs to be displayed 
     * @returns {Boolean}
     */
    needToAuthorize() {
        if (this.sim.skip_auth) {
            return false;
        } 
        return this.sim.launch_prov || this.sim.launch_pt;
    }

    /**
     * Creates and returns the signet JWT code that contains some authorization
     * details.
     * @returns {String}
     */
    createAuthCode() {
        let sim = this.sim,
            scope = this.scope,
            code = {
                context: Object.assign({}, sim.context || {}, {
                    need_patient_banner: !sim.sim_ehr,
                    smart_style_url    : config.baseUrl + "/smart-style.json",
                }),
                client_id: this.request.query.client_id,
                scope    : this.request.query.scope,
                sde      : sim.sde
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
        if (scope.has("openid") && (scope.has("profile") || scope.has("fhirUser"))) {
            
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

        // Add nonce, if provided, so it can be reflected back in the subsequent
        // token request.
        if (this.nonce) {
            code.nonce = this.nonce;
        }

        code.redirect_uri = this.request.query.redirect_uri

        return jwt.sign(code, config.jwtSecret, { expiresIn: "5m" });
    }

    redirect(to, query = {}) {
        let redirectUrl = Url.parse(this.request.originalUrl, true);
        redirectUrl.query = Object.assign(redirectUrl.query, query, {
            aud_validated: this.sim.aud_validated,
            aud          : ""
        });
        redirectUrl.search = null;
        redirectUrl.pathname = redirectUrl.pathname.replace("/auth/authorize", to);
        return this.response.redirect(Url.format(redirectUrl));
    }

    validateParams() {
        const req = this.request;
        const res = this.response;
        const sim = this.sim;

        // Assert that all the required params are present
        // NOTE that "redirect_uri" MUST be first!
        const requiredParams = [
            "redirect_uri",
            "response_type",
            // "client_id",
            // "scope",
            // "state"
        ];
        if (!sim.aud_validated) {
            requiredParams.push("aud");
        }

        const missingParam = Lib.getFirstMissingProperty(req.query, requiredParams);
        if (missingParam) {

            // If redirect_uri is the missing param reply with OAuth.
            // Otherwise redirect and pass error params to the redirect uri.
            throw new Lib.OAuthError(missingParam == "redirect_uri" ? 400 : 302, util.format("Missing %s parameter", missingParam), "invalid_request")
        }

        // bad_redirect_uri if we cannot parse it
        let RedirectURL;
        try {
            RedirectURL = Url.parse(decodeURIComponent(req.query.redirect_uri), true);
        } catch (ex) {
            throw Lib.OAuthError.from(errors.authorization_code.bad_redirect_uri, ex.message)
        }

        // Relative redirect_uri like "whatever" will eventually result in wrong
        // URLs like "/auth/whatever". We must only support full URLs. 
        if (!RedirectURL.protocol) {
            throw Lib.OAuthError.from(errors.authorization_code.no_redirect_uri_protocol, req.query.redirect_uri)
        }

        // The "aud" param must match the apiUrl (but can have different protocol)
        if (!sim.aud_validated) {
            const apiUrl = Lib.buildUrlPath(config.baseUrl, req.baseUrl, "fhir");
            let a = Lib.normalizeUrl(req.query.aud).replace(/^https?/, "").replace(/^:\/\/localhost/, "://127.0.0.1");
            let b = Lib.normalizeUrl(apiUrl       ).replace(/^https?/, "").replace(/^:\/\/localhost/, "://127.0.0.1");
            if (a != b) {
                throw new Lib.OAuthError(302, "Bad audience value", "invalid_request")
            }
            sim.aud_validated = "1";
        }

        return true;
    }

    handle() {
        
        const req = this.request;
        const res = this.response;
        const sim = this.sim;

        // Handle response from picker, login or auth screen
        if (req.query.patient      ) sim.patient       = req.query.patient;
        if (req.query.provider     ) sim.provider      = req.query.provider;
        if (req.query.encounter    ) sim.encounter     = req.query.encounter;
        if (req.query.auth_success ) sim.skip_auth     = "1";
        if (req.query.login_success) sim.skip_login    = "1";
        if (req.query.aud_validated) sim.aud_validated = "1";
        
        // User decided not to authorize the app launch
        if (req.query.auth_success == "0") {
            throw Lib.OAuthError.from(errors.authorization_code.unauthorized)
        }
        
        // Simulate auth_invalid_client_id error if requested
        if (sim.auth_error == "auth_invalid_client_id") {
            throw Lib.OAuthError.from(errors.authorization_code.sim_invalid_client_id)
        }

        // Simulate auth_invalid_redirect_uri error if requested
        if (sim.auth_error == "auth_invalid_redirect_uri") {
            throw Lib.OAuthError.from(errors.authorization_code.sim_invalid_redirect_uri)
        }

        // Simulate auth_invalid_scope error if requested
        if (sim.auth_error == "auth_invalid_scope") {
            throw Lib.OAuthError.from(errors.authorization_code.sim_invalid_scope)
        }

        // Validate query parameters
        this.validateParams();

        // PATIENT LOGIN SCREEN
        if (this.needToLoginAsPatient()) {
            return this.redirect("/login", { patient: sim.patient, login_type: "patient" });
        }

        // PROVIDER LOGIN SCREEN
        if (this.needToLoginAsProvider()) {
            return this.redirect("/login", { provider: sim.provider, login_type: "provider" });
        }

        // PATIENT PICKER
        if (this.needToPickPatient()) {
            return this.redirect("/picker", { patient: sim.patient });
        }

        // ENCOUNTER
        if (this.needToPickEncounter()) {
            return this.redirect("/encounter", { patient: sim.patient, select_first: sim.select_encounter != "1" });
        }

        // AUTH SCREEN
        if (this.needToAuthorize()) {
            return this.redirect("/authorize", { patient: sim.patient });
        }

        // LAUNCH!
        const RedirectURL = Url.parse(decodeURIComponent(req.query.redirect_uri), true);
        RedirectURL.query.code = this.createAuthCode();
        if (req.query.state) {
            RedirectURL.query.state = req.query.state;
        }
        res.redirect(Url.format(RedirectURL));
    }    
}

module.exports = AuthorizeHandler;
