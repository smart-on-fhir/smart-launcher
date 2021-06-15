module.exports = {
    
    // Common errors ----------------------------------------------------------
    
    // Happens on the token endpoint
    bad_grant_type: {
        error: "unsupported_grant_type",
        msg  : 'Invalid or missing grant_type parameter "%s"',
        code : 400,
        type : "oauth"
    },

    // Happens on POST endpoints (token, register...)
    form_content_type_required: {
        error: "invalid_request",
        msg  : "Invalid request content-type header (must be 'application/x-www-form-urlencoded')",
        code : 400,
        type : "oauth"
    },

    // SMART code flow --------------------------------------------------------
    authorization_code: {

        // On this server the registered client object is a JWT passed as code
        invalid_code: {
            error: "invalid_client",
            msg  : "Invalid token (supplied as code parameter in the POST body)",
            code : 400,
            type : "oauth"
        },

        bad_redirect_uri: {
            error: "invalid_request",
            msg  : "Bad redirect_uri: %s",
            code : 400,
            type : "oauth"
        },

        sim_invalid_scope: {
            error: "invalid_scope",
            msg  : "Simulated invalid scope error",
            code : 302,
            type : "oauth"
        },

        sim_invalid_redirect_uri: {
            error: "invalid_request",
            msg  : "Simulated invalid redirect_uri parameter error",
            code : 400,
            type : "oauth"
        },

        sim_invalid_client_id: {
            error: "invalid_client",
            msg  : "Simulated invalid client_id parameter error",
            code : 302,
            type : "oauth"
        },

        unauthorized: {
            error: "invalid_request",
            msg  : "Unauthorized",
            code : 302,
            type : "oauth"
        },

        no_redirect_uri_protocol: {
            error: "invalid_request",
            msg  : "Invalid redirect_uri parameter '%s' (must be full URL)",
            code : 400,
            type : "oauth"
        }
    },

    // SMART refreshToken flow ------------------------------------------------
    refresh_token: {
        invalid_refresh_token: {
            error: "invalid_grant",
            msg  : "Invalid refresh token",
            code : 401,
            type : "oauth"
        },
        expired_refresh_token: {
            error: "invalid_grant",
            msg  : "Expired refresh token",
            code : 403,
            type : "oauth"
        }
    },

    // Backend Services
    client_credentials: {
        missing_client_assertion_type: {
            error: "invalid_request",
            msg  : 'Missing "client_assertion_type" parameter',
            code : 400,
            type : "oauth"
        },
        invalid_client_assertion_type: {
            error: "invalid_request",
            msg  : 'Invalid client_assertion_type parameter. Must be "urn:ietf:params:oauth:client-assertion-type:jwt-bearer".',
            code : 400,
            type : "oauth"
        },
        missing_registration_token: {
            error: "invalid_request",
            msg  : 'Missing "client_assertion" parameter. Must be a JWT.',
            code : 400,
            type : "oauth"
        },
        invalid_registration_token: {
            error: "invalid_request",
            msg  : 'Invalid "client_assertion" parameter. Must be a JWT.',
            code : 400,
            type : "oauth"
        },
        invalid_client_details_token: {
            error: "invalid_client",
            msg  : "Invalid client details token: %s",
            code : 401,
            type : "oauth"
        },
        token_expired_registration_token: {
            error: "invalid_client",
            msg  : "Registration token expired",
            code : 401,
            type : "oauth"
        },
        invalid_aud: {
            error: "invalid_client",
            msg  : "Invalid token 'aud' value. Must be '%s'.",
            code : 401,
            type : "oauth"
        },
        invalid_token_iss: {
            error: "invalid_client",
            msg  : "The given service url '%s' does not match the registered '%s'",
            code : 401,
            type : "oauth"
        },
        invalid_jti: {
            error: "invalid_client",
            msg  : "Invalid 'jti' value",
            type : "oauth",
            code : 401
        },
        invalid_scope: {
            error: "invalid_scope",
            msg  : 'Invalid scope: "%s"',
            type : "oauth",
            code : 403
        },
        simulated_invalid_scope: {
            error: "invalid_scope",
            msg  : "Simulated invalid scope error",
            type : "oauth",
            code : 403
        },
        invalid_token: {
            error: "invalid_client",
            msg  : "Invalid token!",
            type : "oauth",
            code : 401
        },
        simulated_invalid_client_secret: {
            error: "invalid_client",
            msg  : "Simulated invalid client secret error",
            type : "oauth",
            code : 401
        },
        empty_auth_header: {
            error: "invalid_request",
            msg  : "The authorization header '%s' cannot be empty",
            type : "oauth",
            code : 401
        },
        bad_auth_header: {
            error: "invalid_request",
            msg  : "Bad authorization header '%s': %s",
            type : "oauth",
            code : 401
        }
    },

    registration: {
        missing_param: {
            error: "invalid_request",
            msg  : 'Missing parameter "%s"',
            code : 400,
            type : "oauth"
        },
        invalid_param: {
            error: "invalid_request",
            msg  : 'Invalid parameter "%s"',
            code : 400,
            type : "oauth"
        }
    }
};
