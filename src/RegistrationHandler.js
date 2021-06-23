const jwt    = require("jsonwebtoken")
const config = require("./config")
const errors = require("./errors")

/** @type any */
const assert = require("./lib").assert

module.exports = function handleRegistration(req, res) {
        
    // Require "application/x-www-form-urlencoded" POSTs
    assert(req.is("application/x-www-form-urlencoded"), errors.form_content_type_required)

    // parse and validate the "iss" parameter
    let iss = String(req.body.iss || "").trim()
    assert(iss, errors.registration.missing_param, "iss")
    
    // parse and validate the "pub_key" parameter
    let publicKey = String(req.body.pub_key || "").trim()
    assert(publicKey, errors.registration.missing_param, "pub_key")

    // parse and validate the "dur" parameter
    let dur = parseInt(req.body.dur || "15", 10)
    assert(!isNaN(dur) && isFinite(dur) && dur >= 0, errors.registration.invalid_param, "dur")

    // Build the result token
    let jwtToken = { pub_key: publicKey, iss }

    // Note that if dur is 0 accessTokensExpireIn will not be included
    if (dur) {
        jwtToken.accessTokensExpireIn = dur
    }

    // Custom errors (if any)
    if (req.body.auth_error) {
        jwtToken.auth_error = req.body.auth_error
    }

    // Reply with signed token as text
    res.type("text").send(jwt.sign(jwtToken, config.jwtSecret))
}
