const jwt = require("jsonwebtoken");
const config = require("./config");

const OIDC_ISSUER_PUBLIC_KEY  = config.privateKeyAsPem;
const AUTH_SERVER_PRIVATE_KEY = config.jwtSecret;

/**
 * @see: https://tools.ietf.org/html/rfc7662
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
module.exports = (req, res) => {

    // To prevent token scanning attacks, the endpoint MUST also require
    // some form of authorization to access this endpoint
    if(!req.headers.authorization) {
        res.status(401).send("Authorization is required");
        return
    }

    // Validate authorization token
    try {
        jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret);
    } catch (e) {
        return res.status(401).send(`${e.name || "Error"}: ${e.message || "Invalid token"}`);
    }

    // Verify that a token is submitted
    if (!req.body.token) {
        return res.status(400).send("No token provided");
    }

    try {
        /** @type {any} */
        const verified = jwt.verify(req.body.token, AUTH_SERVER_PRIVATE_KEY);
        let id_claims = {}
        try {
            id_claims = jwt.verify(verified.id_token, OIDC_ISSUER_PUBLIC_KEY);
        } catch {}

        res.json({
            ...verified,
            active: true,
            refresh_token: undefined,
            id_token: undefined,
            iss: id_claims.iss,
            sub: id_claims.sub,
            fhirUser: id_claims.fhirUser,
        });
    } catch (err) {
        res.json({ active: false, error: err })
    }
};
