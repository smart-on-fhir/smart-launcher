const { read } = require("fs");
const jwt        = require("jsonwebtoken");
const config     = require("./config");

// Spec: https://tools.ietf.org/html/rfc7662
function introspectionHandler(req, res) {

    /* "To prevent token scanning attacks, the endpoint MUST also require
    some form of authorization to access this endpoint" */

    // Validate authorization token ----------------------------------------------------------
    if(!req.headers.authorization) {
        res.status(401).send("Authorization is required");
        return
    }

    try {
        jwt.verify(
            req.headers.authorization.split(" ")[1],
            config.jwtSecret
        );
    } catch (e) {
        return res.status(401).send(
            `${e.name || "Error"}: ${e.message || "Invalid token"}`
        );
    }

    // In theory, there could be some further authorization step, such as in a case where a 3rd party server had
    // many tokens under its management. However, the only real work the server is doing here is to disclose
    // that the JWT is valid, which an un-authorized user could determine by using it as the authorization token.

    // Perform introspection

    if (!req.body.token) {
        return res.status(400).send("No token provided");
    }

    let response;

    try {
        const token = jwt.verify(req.body.token, config.jwtSecret)
    
        response = {
    
            /*  REQUIRED.  Boolean indicator of whether or not the presented token
            is currently active.  The specifics of a token's "active" state
            will vary depending on the implementation of the authorization
            server and the information it keeps about its tokens, but a "true"
            value return for the "active" property will generally indicate
            that a given token has been issued by this authorization server,
            has not been revoked by the resource owner, and is within its
            given time window of validity (e.g., after its issuance time and
            before its expiration time).  See Section 4 for information on
            implementation of such checks. */
            active: true,
    
            /* OPTIONAL.  A JSON string containing a space-separated list of
            scopes associated with this token, in the format described in
            Section 3.3 of OAuth 2.0 [RFC6749]. */
            scope: token.scope,
    
            /* OPTIONAL.  Client identifier for the OAuth 2.0 client that
            requested this token. */
            client_id: token.client_id,
    
            /* OPTIONAL.  Human-readable identifier for the resource owner who
            authorized this token. */
            username: token.username, 
    
            /*   OPTIONAL.  Type of the token as defined in Section 5.1 of OAuth
            2.0 [RFC6749]. */
            token_type: token.token_type,
    
            /* OPTIONAL.  Integer timestamp, measured in the number of seconds
            since January 1 1970 UTC, indicating when this token will expire,
            as defined in JWT [RFC7519]. */
            exp: token.exp,
    
            /* OPTIONAL.  Integer timestamp, measured in the number of seconds
            since January 1 1970 UTC, indicating when this token was
            originally issued, as defined in JWT [RFC7519]. */
            iat: token.iat,
    
            /* OPTIONAL.  Integer timestamp, measured in the number of seconds
            since January 1 1970 UTC, indicating when this token is not to be
            used before, as defined in JWT [RFC7519]. */
            nbf: token.nbf,

            // OPTIONAL.  Subject of the token, as defined in JWT [RFC7519].
            // Usually a machine-readable identifier of the resource owner who
            // authorized this token.
            sub: token.sub,
      
            // OPTIONAL.  Service-specific string identifier or list of string
            // identifiers representing the intended audience for this token, as
            // defined in JWT [RFC7519].
            aud: token.aud,
            
            // OPTIONAL.  String representing the issuer of this token, as
            // defined in JWT [RFC7519].
            iss: token.iss,
      
            // OPTIONAL.  String identifier for the token, as defined in JWT
            // [RFC7519].
            jti: token.jti,
        }
    } catch {
        // If the introspection call is properly authorized but the token is not
        // active, does not exist on this server, or the protected resource is
        // not allowed to introspect this particular token, then the
        // authorization server MUST return an introspection response with the
        // "active" field set to "false".  Note that to avoid disclosing too
        // much of the authorization server's state to a third party, the
        // authorization server SHOULD NOT include any additional information
        // about an inactive token, including why the token is inactive.
        response = { active: false }
    }

    res.json(response)
}

module.exports = { introspectionHandler }