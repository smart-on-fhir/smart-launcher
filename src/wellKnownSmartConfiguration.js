
// /.well-known/smart-configuration
module.exports = (req, res) => {
    const json = {
        // REQUIRED, URL to the OAuth2 authorization endpoint.
        "authorization_endpoint": "https://ehr.example.com/auth/authorize",

        // REQUIRED, URL to the OAuth2 token endpoint.
        "token_endpoint": "https://ehr.example.com/auth/token",

        // OPTIONAL, if available, URL to the OAuth2 dynamic registration endpoint for this FHIR server.
        "registration_endpoint": "https://ehr.example.com/auth/register",

        // RECOMMENDED, URL where an end-user can view which applications
        // currently have access to data and can make adjustments to these
        // access rights.
        "management_endpoint": "https://ehr.example.com/user/manage"

        // RECOMMENDED, URL to a server’s introspection endpoint that can be
        // used to validate a token.
        "introspection_endpoint": "https://ehr.example.com/user/introspect"

        // RECOMMENDED, URL to a server’s revoke endpoint that can be used to
        // revoke a token.
        "revocation_endpoint": "https://ehr.example.com/user/revoke",

        // OPTIONAL, array of client authentication methods supported by the
        // token endpoint. The options are “client_secret_post” and “client_secret_basic”.
        "token_endpoint_auth_methods_supported": [
            "client_secret_basic"
        ],

        // RECOMMENDED, array of scopes a client may request. See scopes and launch context.
        "scopes_supported": [
            "openid",
            "profile",
            "launch",
            "launch/patient",
            "patient/*.*",
            "user/*.*",
            "offline_access"
        ],

        // RECOMMENDED, array of OAuth2 response_type values that are supported
        "response_types_supported": [
            "code",
            "code id_token",
            "id_token",
            "refresh_token"
        ],
        
        // REQUIRED, array of strings representing SMART capabilities
        // (e.g., single-sign-on or launch-standalone) that the server supports.
        "capabilities": [
            "launch-ehr",
            "client-public",
            "client-confidential-symmetric",
            "context-ehr-patient",
            "sso-openid-connect"
        ]
    };

    res.json(json);
};
