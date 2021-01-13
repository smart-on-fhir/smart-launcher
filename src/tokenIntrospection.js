const { exception } = require("console");
const jwkToPem     = require("jwk-to-pem");
const jwt        = require("jsonwebtoken");

const config = require("./config");

const OIDC_ISSUER_PUBLIC_KEY = jwkToPem(config.oidcKeypair, { private: false });
const AUTH_SERVER_PRIVATE_KEY = config.jwtSecret;

module.exports = (req, res) => {
    try {
        const verified = jwt.verify(req.body.token, AUTH_SERVER_PRIVATE_KEY);
        let id_claims = {}
        try {
            id_claims = jwt.verify(verified.id_token, OIDC_ISSUER_PUBLIC_KEY);
        } catch {

        }

        res.json({
            ...verified,
            active: true,
            refresh_token: undefined,
            id_token: undefined,
            iss:  id_claims.iss,
            sub:  id_claims.sub,
            fhirUser:  id_claims.fhirUser,
        });

    } catch (err) {
        res.json({active: false, error: err})
    }
};
