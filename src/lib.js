const jwt        = require("jsonwebtoken");
const config     = require("./config");
const util       = require("util")
const { STATUS_CODES } = require("http");
const OperationOutcome = require("./OperationOutcome");

const RE_FALSE = /^(0|no|false|off|null|undefined|NaN|)$/i;

/**
 * Walks thru an object (ar array) and returns the value found at the
 * provided path. This function is very simple so it intentionally does not
 * support any argument polymorphism, meaning that the path can only be a
 * dot-separated string. If the path is invalid returns undefined.
 * @param {Object} obj The object (or Array) to walk through
 * @param {String} path The path (eg. "a.b.4.c")
 * @returns {*} Whatever is found in the path or undefined
 */
function getPath(obj, path = "") {
    return path.split(".").reduce((out, key) => out ? out[key] : undefined, obj)
}

function generateRefreshToken(code) {
    let token = {};
    ["context", "client_id", "scope", "user", "iat"/*, "exp"*/, "auth_error"].forEach(key => {
        if (code.hasOwnProperty(key)) {
            token[key] = code[key];
        }
    });
    return jwt.sign(token, config.jwtSecret, {
        expiresIn: +config.refreshTokenLifeTime * 60
    });
}

function getFirstMissingProperty(object, properties) {
    return (Array.isArray(properties) ? properties : [properties]).find(
        param => !object[param]
    );
}

function bool(x) {
    return !RE_FALSE.test(String(x).trim());
}

function operationOutcome(res, message, {
    httpCode  = 500,
    issueCode = "processing", // http://hl7.org/fhir/valueset-issue-type.html
    severity  = "error"       // fatal | error | warning | information
} = {}){
    const oo = new OperationOutcome(message, issueCode, severity)
    return res.status(httpCode).json(oo.toJSON());
}

/**
 * Given a request object, returns its base URL
 */
function getRequestBaseURL(req) {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
    return protocol + "://" + host;
}

// Sandbox-ify -----------------------------------------------------------------

function buildUrlPath(...segments) {
    return segments.map(
        s => String(s)
            .replace(/^\//, "")
            .replace(/\/$/, "")
    ).join("\/");
}

function normalizeUrl(url) {
    return buildUrlPath(url).toLowerCase();
}

/**
 * Checks if the currentValue is within the white-listed values. If so, returns
 * it. Otherwise returns the defaultValue if one is set, or throws an exception
 * if no defaultValue is provided.
 * @param {any[]} allowedValues 
 * @param {*} currentValue 
 * @param {*} [defaultValue] 
 */
function whitelist(allowedValues, currentValue, defaultValue) {
    if (allowedValues.indexOf(currentValue) == -1) {
        if (arguments.length < 3) {
            throw new Error(
                `The value "${currentValue}" is not allowed. Must be one of ${
                    allowedValues.join(", ")
                }.`
            )
        }
        return defaultValue
    }
    return currentValue
}

/**
 * @param {*} condition 
 * @param {string|Error|{error:string, msg:string, code:number, type:string}} message
 * @param {any[]} rest
 * @returns {asserts condition}
 */
function assert(condition, message, ...rest) {
    if (typeof condition == "function") {
        try {
            condition()
        } catch (ex) {
            assert.fail(message, ...rest, ex.message)
        }
    }
    else if (!(condition)) {
        assert.fail(message, ...rest)
    }
}

/**
 * @param {*} condition 
 * @param {number} code 
 * @param {string} [message]
 * @param {any[]} rest
 */
assert.http = function(condition, code, message="", ...rest) {
    if (typeof condition == "function") {
        try {
            condition()
        } catch (ex) {
            throw new HTTPError(code, util.format(message, ...rest, ex.message))
        }
    }
    else if (!(condition)) {
        throw new HTTPError(code, util.format(message, ...rest))
    }
}

/**
 * @param {string|Error|{error:string, msg:string, code:number, type?:string}} error
 * @param {any[]} rest
 * @throws {HTTPError}
 */
assert.fail = function(error, ...rest) {
    if (error && typeof error === "object") {
        if (error instanceof Error) {
            throw error
        }

        const { msg, code, type } = error

        if (type === "oauth") {
            throw new OAuthError(code, util.format(msg, ...rest), error.error)
        }

        if (type === "OperationOutcome") {
            throw new OperationOutcomeError(code, util.format(msg, ...rest))
        }
        
        throw new HTTPError(code, util.format(msg, ...rest))
    }
    
    throw new HTTPError(500, util.format(error, ...rest))
}

///////////////////////////////////////////////////////////////////////////////
class HTTPError extends Error
{
    /**
     * @type {number}
     */
    status;

    /**
     * @param {number} status 
     * @param {string} [message]
     */
    constructor(status, message = "") {
        super(message || STATUS_CODES[status] || "Unknown error")
        this.status = status
    }

    render(req, res) {
        res.status(this.status).type("text").end(this.message)
    }
}
class OAuthError extends HTTPError
{    
    /**
     * @type {string}
     */
    errorId;

    /**
     * @param {number} status 
     * @param {string} message 
     * @param {string} errorId 
     */
    constructor(status, message, errorId) {
        super(status, message)
        this.errorId = errorId
    }

    /**
     * 
     * @param {{msg:string,code:number,error:string,[key:string]:any}} config
     */
    static from({ msg, code, error }, ...args) {
        return new OAuthError(code, util.format(msg, ...args), error)
    }
    
    render(req, res) {
        if ([301, 302, 303, 307, 308].indexOf(this.status) > -1) {
            let inputs = req.method == "POST" ? req.body : req.query;
            let redirectURL = new URL(inputs.redirect_uri);
            redirectURL.searchParams.set("error", this.errorId);
            redirectURL.searchParams.set("error_description", this.message);
            if (inputs.state) {
                redirectURL.searchParams.set("state", inputs.state);
            }
            return res.redirect(this.status, redirectURL.href);
        }

        return res.status(this.status).json({
            error: this.errorId,
            error_description: this.message
        });
    }
}

class OperationOutcomeError extends HTTPError
{    
    render(req, res) {
        operationOutcome(res, this.message, { httpCode: this.status })
    }
}


module.exports = {
    getPath,
    generateRefreshToken,
    getFirstMissingProperty,
    bool,
    operationOutcome,
    buildUrlPath,
    normalizeUrl,
    getRequestBaseURL,
    whitelist,
    assert,

    HTTPError,
    OAuthError,
    OperationOutcomeError
};
