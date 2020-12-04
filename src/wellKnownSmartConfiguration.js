const config = require("./config");
const { getRequestBaseURL } = require("./lib");


module.exports = (req, res) => {
    const prefix = `${getRequestBaseURL(req)}${
        (req.originalUrl || req.originalUrl)
        .replace(/\/fhir\/\.well-known\/smart-configuration$/, "")
        }${config.authBaseUrl}`;
    
    const json = {

        // REQUIRED, URL to the OAuth2 authorization endpoint.
        authorization_endpoint: `${prefix}/authorize`,

        // REQUIRED, URL to the OAuth2 token endpoint.
        token_endpoint: `${prefix}/token`,

        // OPTIONAL, if available, URL to the OAuth2 dynamic registration endpoint for this FHIR server.
        registration_endpoint: undefined,

        // RECOMMENDED, URL where an end-user can view which applications
        // currently have access to data and can make adjustments to these
        // access rights.
        "management_endpoint": undefined,

        // RECOMMENDED, URL to a server’s introspection endpoint that can be
        // used to validate a token.
        "introspection_endpoint": `${prefix}/introspect`,

        // RECOMMENDED, URL to a server’s revoke endpoint that can be used to
        // revoke a token.
        "revocation_endpoint": undefined,

        // OPTIONAL, array of client authentication methods supported by the
        // token endpoint. The options are “client_secret_post” and “client_secret_basic”.
        "token_endpoint_auth_methods_supported": [
            "client_secret_basic", // for confidential apps
            "client_secret_post"   // for public apps
        ],

        // RECOMMENDED, array of scopes a client may request. See scopes and launch context.
        "scopes_supported": [
            "openid",
            "profile",
            "fhirUser",
            "launch",
            "launch/patient",
            "launch/encounter",
            "patient/*.*",
            "user/*.*",
            "offline_access"
        ],

        // RECOMMENDED, array of OAuth2 response_type values that are supported
        "response_types_supported": [
            "code",
        //     "code id_token",
        //     "id_token",
        //     "refresh_token"
        ],

        // REQUIRED, array of strings representing SMART capabilities
        // (e.g., single-sign-on or launch-standalone) that the server supports.
        "capabilities": [

            // Launch Modes
            // -----------------------------------------------------------------

            // support for SMART’s EHR Launch mode.
            "launch-ehr",

            // support for SMART’s Standalone Launch mode.
            "launch-standalone",


            // Client Types
            // -----------------------------------------------------------------

            // support for SMART’s public client profile (no client authentication).
            "client-public", 

            // support for SMART’s confidential client profile (symmetric
            // client secret authentication).
            "client-confidential-symmetric",

            // Single Sign-on
            // -----------------------------------------------------------------

            // support for SMART’s OpenID Connect profile.
            // sso-openid-connect

            // Launch Context
            // -----------------------------------------------------------------
            
            // support for “need patient banner” launch context (conveyed via
            // need_patient_banner token parameter).
            "context-passthrough-banner",

            // support for “SMART style URL” launch context (conveyed via
            // smart_style_url token parameter).
            "context-passthrough-style",
            

            // Launch Context for EHR Launch
            // -----------------------------------------------------------------

            // support for patient-level launch context (requested by
            // launch/patient scope, conveyed via patient token parameter).
            "context-ehr-patient",
            
            // support for encounter-level launch context (requested by
            // launch/encounter scope, conveyed via encounter token parameter).
            "context-ehr-encounter",


            // Launch Context for Standalone Launch
            // -----------------------------------------------------------------

            // support for patient-level launch context (requested by
            // launch/patient scope, conveyed via patient token parameter).
            "context-standalone-patient",

            // support for encounter-level launch context (requested by
            // launch/encounter scope, conveyed via encounter token parameter).
            "context-standalone-encounter",


            // Permissions
            // -----------------------------------------------------------------

            // support for refresh tokens (requested by offline_access scope).
            "permission-offline",

            // support for patient-level scopes (e.g. patient/Observation.read).
            "permission-patient",

            // support for user-level scopes (e.g. user/Appointment.read).
            "permission-user"
        ]
    };

    res.json(json);
};
