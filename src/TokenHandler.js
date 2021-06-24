const crypto       = require("crypto")
const jwt          = require("jsonwebtoken")
const jose         = require("node-jose")
const config       = require("./config")
const SMARTHandler = require("./SMARTHandler")
const Lib          = require("./lib")
const ScopeSet     = require("./ScopeSet")
const errors       = require("./errors")

/** @type {typeof Lib.assert} */
const assert = require("./lib").assert;

class TokenHandler extends SMARTHandler {

    /**
     * This is the typical public static entry point designed to be easy to use
     * as route handler.
     * @param {Object} req 
     * @param {Object} res 
     */
    static handleRequest(req, res) {
        return new TokenHandler(req, res).handle();
    }

    /**
     * Validates that the request is form-urlencoded" POST and then uses the
     * grant_type parameter to pick the right flow
     */
    handle() {
        const req = this.request;

        // Require "application/x-www-form-urlencoded" POSTs
        assert(req.is("application/x-www-form-urlencoded"), errors.form_content_type_required);

        switch (req.body.grant_type) {
            case "client_credentials":
                return this.handleBackendService();
            case "authorization_code":
                return this.handleAuthorizationCode();
            case "refresh_token":
                return this.handleRefreshToken();
            default:
                assert.fail(errors.bad_grant_type, req.body.grant_type);
        }
    }

    /**
     * Handles the backend service authorization requests. Parses and validates
     * input params and eventually calls this.finish() with the parsed client
     * details token.
     */
    handleBackendService() {
        const {
            originalUrl,
            body: {
                client_assertion_type,
                client_assertion,
                scope
            }
        } = this.request;

        const { baseUrl, jwtSecret } = config;

        /** @type {any[]} */
        const algorithms = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512"];

        const aud = baseUrl + originalUrl;

        /** @type {any} */
        let authenticationToken = {};

        /** @type {any} */
        let clientDetailsToken = {};

        let scopeError = "";

        // client_assertion_type is required
        assert(client_assertion_type, errors.client_credentials.missing_client_assertion_type);

        // client_assertion_type must have a fixed value
        assert(client_assertion_type == "urn:ietf:params:oauth:client-assertion-type:jwt-bearer", errors.client_credentials.invalid_client_assertion_type)

        // client_assertion must be a sent
        assert(client_assertion, errors.client_credentials.missing_registration_token);

        // client_assertion must be a token
        assert(() => authenticationToken = jwt.decode(client_assertion), errors.client_credentials.invalid_registration_token);

        // client_assertion must be a parsed
        assert(authenticationToken, errors.client_credentials.invalid_registration_token);

        // The client_id must be valid token
        assert(() => clientDetailsToken = jwt.verify(authenticationToken.sub, jwtSecret), errors.client_credentials.invalid_client_details_token);

        // simulate expired_registration_token error
        assert(clientDetailsToken.auth_error != "token_expired_registration_token", errors.client_credentials.token_expired_registration_token);

        // Validate authenticationToken.aud (must equal this url)
        assert(aud.replace(/^https?/, "") == authenticationToken.aud.replace(/^https?/, ""), errors.client_credentials.invalid_aud, aud);

        // authenticationToken.iss must equal whatever the user entered at registration time, i.e. clientDetailsToken.iss)
        assert(authenticationToken.iss == clientDetailsToken.iss, errors.client_credentials.invalid_token_iss, authenticationToken.iss, clientDetailsToken.iss);

        // simulated invalid_jti error
        assert(clientDetailsToken.auth_error != "invalid_jti", errors.client_credentials.invalid_jti);

        // Validate scope
        assert(!(scopeError = ScopeSet.getInvalidSystemScopes(scope)), errors.client_credentials.invalid_scope, scopeError);

        // simulated token_invalid_scope
        assert(clientDetailsToken.auth_error != "token_invalid_scope", errors.client_credentials.simulated_invalid_scope);

        // Verify the client_assertion token signature
        assert(() => jwt.verify(client_assertion, clientDetailsToken.pub_key, { algorithms }), errors.client_credentials.invalid_token);

        return this.finish(clientDetailsToken);
    }

    /**
     * Handles the common authorization requests. Parses and validates
     * token from request.body.code and eventually calls this.finish() with it.
     */
    handleAuthorizationCode() {
        /** @type {any} */
        let token;

        assert(() => token = jwt.verify(this.request.body.code, config.jwtSecret), errors.authorization_code.invalid_code);
        
        assert(token.redirect_uri, errors.authorization_code.invalid_code);

        assert(this.request.body.redirect_uri, {
            type : "oauth",
            code : 400,
            error: "invalid_request",
            msg  : "Missing redirect_uri parameter"
        });

        assert(token.redirect_uri === this.request.body.redirect_uri, {
            type : "oauth",
            code : 401,
            error: "invalid_request",
            msg  : "Invalid redirect_uri parameter"
        });

        if (token.code_challenge_method === 'S256') {
            const hash = crypto.createHash('sha256');
            hash.update(this.request.body.code_verifier || "");
            const code_challenge = jose.util.base64url.encode(hash.digest());
            if (code_challenge !== token.code_challenge) {
                throw Lib.OAuthError.from({
                    code : 401,
                    error: "invalid_grant",
                    msg  : "Invalid grant or Invalid PKCE Verifier, '%s' vs '%s'."
                }, code_challenge, token.code_challenge);
            }
        }

        return this.finish(token);
    }

    /**
     * Handles the refresh_token authorization requests. Parses and validates
     * token from request.body.refresh_token and eventually calls this.finish()
     * with it.
     */
    handleRefreshToken() {
        /** @type {any} */
        let token;
        assert(() => token = jwt.verify(this.request.body.refresh_token, config.jwtSecret), errors.refresh_token.invalid_refresh_token);
        assert(token.auth_error != "token_expired_refresh_token", errors.refresh_token.expired_refresh_token);
        return this.finish(token);
    }

    /**
     * Validates authorization header and/or triggers custom authorization
     * errors for confidential clients
     */
    validateBasicAuth(clientDetailsToken) {
        const authHeader = this.request.headers.authorization;
        
        if (!authHeader || authHeader.search(/^basic\s*/i) !== 0) {
            return;
        }

        const req = this.request;

        // Simulate invalid client secret error
        assert(
            req.body.auth_error != "auth_invalid_client_secret" &&
            clientDetailsToken.auth_error != "auth_invalid_client_secret",
            errors.client_credentials.simulated_invalid_client_secret
        )

        let auth = authHeader.replace(/^basic\s*/i, "")
        
        // Check for empty auth
        assert(auth, errors.client_credentials.empty_auth_header, authHeader)

        // Check for invalid base64
        assert(
            () => auth = Buffer.from(auth, "base64").toString().split(":"),
            errors.client_credentials.bad_auth_header,
            authHeader
        )

        // Check for bad auth syntax
        assert(
            auth.length === 2,
            errors.client_credentials.bad_auth_header,
            authHeader,
            "The decoded header must contain '{client_id}:{client_secret}'"
        )
    }

    /**
     * Generates the id token that is included in the response if needed
     * @param {Object} clientDetailsToken
     */
    createIdToken(clientDetailsToken) {
        // let secure = this.request.secure || this.request.headers["x-forwarded-proto"] == "https";
        // let iss    = config.baseUrl.replace(/^https?/, secure ? "https" : "http");
        let iss    = `${Lib.getRequestBaseURL(this.request)}${this.request.baseUrl}/fhir`
        let payload = {
            profile : clientDetailsToken.user,
            fhirUser: clientDetailsToken.user,
            aud     : clientDetailsToken.client_id,
            sub     : crypto.createHash('sha256').update(clientDetailsToken.user).digest('hex'),
            iss
        };
        // Reflect back the nonce if it was provided in the original Authentication
        // Request.
        let { nonce } = clientDetailsToken;
        if (nonce) {
            payload.nonce = nonce;
        }

        return jwt.sign(payload, config.privateKeyAsPem, {
            algorithm: "RS256",
            expiresIn: `${(clientDetailsToken.accessTokensExpireIn || 60)} minutes`
        });
    }

    /**
     * Generates and sends the response
     * @param {Object} clientDetailsToken 
     */
    finish(clientDetailsToken) {

        const req = this.request;
        const res = this.response;

        // Request from confidential client
        this.validateBasicAuth(clientDetailsToken)

        const scope = new ScopeSet(decodeURIComponent(clientDetailsToken.scope));

        assert(clientDetailsToken.auth_error != "token_invalid_token", errors.client_credentials.invalid_token);
        
        // refresh_token
        if (scope.has('offline_access') || scope.has('online_access')) {
            clientDetailsToken.context.refresh_token = Lib.generateRefreshToken(clientDetailsToken);
        }

        const expiresIn = clientDetailsToken.accessTokensExpireIn ?
            clientDetailsToken.accessTokensExpireIn * 60 :
            req.body.grant_type === 'client_credentials' ?
                +config.backendServiceAccessTokenLifetime * 60 :
                +config.accessTokenLifetime * 60;
    
        var token = {
            ...clientDetailsToken.context,
            token_type: "bearer",
            scope     : clientDetailsToken.scope,
            client_id : clientDetailsToken.client_id || req.body.client_id,
            expires_in: expiresIn
        };
    
        // sim_error
        if (clientDetailsToken.auth_error == "request_invalid_token") {
            token.sim_error = "Invalid token";
        } else if (clientDetailsToken.auth_error == "request_expired_token") {
            token.sim_error = "Token expired";
        }
    
        // id_token
        if (clientDetailsToken.user && scope.has("openid") && (scope.has("profile") || scope.has("fhirUser"))) {
            token.id_token = this.createIdToken(clientDetailsToken);
        }

        if (clientDetailsToken.sde) {
            token.serviceDiscoveryURL = clientDetailsToken.sde
        }
    
        // access_token
        token.access_token = jwt.sign(token, config.jwtSecret, { expiresIn });

        // The authorization servers response must include the HTTP
        // Cache-Control response header field with a value of no-store,
        // as well as the Pragma response header field with a value of no-cache.
        res.set({
            "Cache-Control": "no-store",
            "Pragma": "no-cache"
        });

        res.json(token);
    }
}

module.exports = TokenHandler;
