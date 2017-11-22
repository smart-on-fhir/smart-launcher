// @ts-check
const jwt          = require("jsonwebtoken");
const base64url    = require("base64-url");
const Url          = require("url");
const ScopeSet     = require("./ScopeSet");
const config       = require("./config");
const Codec        = require("../static/codec.js");
const Lib          = require("./lib");
const SMARTHandler = require("./SMARTHandler");

class AuthorizeHandler extends SMARTHandler {

    static handleRequest(req, res) {
        return new AuthorizeHandler(req, res).handle();
    }

    constructor(req, res) {
        super(req, res);
        this.sim = this.getRequestedSIM();
        this.scope = new ScopeSet(decodeURIComponent(req.query.scope));
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
     * Decides if a provider login screen needs to be displayed  
     * @returns {Boolean}
     */
    needToLoginAsProvider() {
        
        // In patient-standalone launch the patient is the user
        if (this.sim.launch_pt) {
            return false;
        }
    
        // Require both "openid" and "profile" scopes
        if (!this.scope.has("openid") || !this.scope.has("profile")) {
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
    
        // Yes - if 0 or multiple patients selected and ehr launch and launch/patient oor launch scope
        if (this.sim.launch_ehr && (this.scope.has("launch/patient") || this.scope.has("launch"))) {
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
                context: {
                    need_patient_banner: !sim.sim_ehr,
                    smart_style_url    : config.baseUrl + "/smart-style.json",
                },
                client_id: this.request.query.client_id,
                scope    : this.request.query.scope
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

    redirect(to, query = {}) {
        let redirectUrl = Url.parse(this.request.originalUrl, true);
        redirectUrl.query = Object.assign(redirectUrl.query, query, {
            aud_validated: this.sim.aud_validated,
            aud          : ""
        });
        redirectUrl.search = null;
        redirectUrl.pathname = redirectUrl.pathname.replace(
            config.authBaseUrl + "/authorize",
            to
        );
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
            if (missingParam == "redirect_uri") {
                Lib.replyWithError(res, "missing_parameter", 400, missingParam);
            }
            else {
                Lib.redirectWithError(req, res, "missing_parameter", missingParam);
            }
            return false;
        }

        // bad_redirect_uri if we cannot parse it
        let RedirectURL;
        try {
            RedirectURL = Url.parse(decodeURIComponent(req.query.redirect_uri), true);
        } catch (ex) {
            Lib.replyWithError(res, "bad_redirect_uri", 400, ex.message);
            return false;
        }

        // Relative redirect_uri like "whatever" will eventually result in wrong
        // URLs like "/auth/whatever". We must only support full URLs. 
        if (!RedirectURL.protocol) {
            Lib.replyWithError(res, "no_redirect_uri_protocol", 400, req.query.redirect_uri);
            return false;
        }

        // The "aud" param must match the apiUrl (but can have different protocol)
        if (!sim.aud_validated) {
            const apiUrl = Lib.buildUrlPath(
                config.baseUrl,
                req.baseUrl.replace(config.authBaseUrl, config.fhirBaseUrl)
            );
            if (Lib.normalizeUrl(req.query.aud).replace(/^https?/, "") != Lib.normalizeUrl(apiUrl).replace(/^https?/, "")) {
                Lib.redirectWithError(req, res, "bad_audience");
                return false;
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
            return Lib.redirectWithError(req, res, "unauthorized");
        }
        
        // Simulate auth_invalid_client_id error if requested
        if (sim.auth_error == "auth_invalid_client_id") {
            return Lib.redirectWithError(req, res, "sim_invalid_client_id");
        }

        // Simulate auth_invalid_redirect_uri error if requested
        if (sim.auth_error == "auth_invalid_redirect_uri") {
            return Lib.redirectWithError(req, res, "sim_invalid_redirect_uri");
        }

        // Simulate auth_invalid_scope error if requested
        if (sim.auth_error == "auth_invalid_scope") {
            return Lib.redirectWithError(req, res, "sim_invalid_scope");
        }

        // Validate query parameters
        if (!this.validateParams()) {
            return;
        }

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
