const jwt    = require("jsonwebtoken");
const config = require("./config");
const Url    = require("url");

const RE_GT    = />/g;
const RE_LT    = /</g;
const RE_AMP   = /&/g;
const RE_QUOT  = /"/g;
const RE_FALSE = /^(0|no|false|off|null|undefined|NaN|)$/i;

function htmlEncode(html) {
    return String(html)
        .trim()
        .replace(RE_AMP , "&amp;")
        .replace(RE_LT  , "&lt;")
        .replace(RE_GT  , "&gt;")
        .replace(RE_QUOT, "&quot;");
}

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

/**
 * Simplified version of printf. Just replaces all the occurrences of "%s" with
 * whatever is supplied in the rest of the arguments. If no argument is supplied
 * the "%s" token is left as is.
 * @param {String} s The string to format
 * @param {*} ... The rest of the arguments are used for the replacements
 * @return {String}
 */
function printf(s) {
    var args = arguments, l = args.length, i = 0;
    return String(s || "").replace(/(%s)/g, a => ++i > l ? "" : args[i]);
}

function generateRefreshToken(code) {
    let token = {};
    ["context", "client_id", "scope", "user", "iat", "exp", "auth_error"].forEach(key => {
        if (code.hasOwnProperty(key)) {
            token[key] = code[key];
        }
    });
    return jwt.sign(token, config.jwtSecret);
}

function redirectWithError(req, res, name, ...rest) {
    let redirectURL = Url.parse(req.query.redirect_uri, true);
    redirectURL.query.error = name;
    redirectURL.query.error_description = getErrorText(name, ...rest);
    return res.redirect(Url.format(redirectURL));
}

function replyWithError(res, name, code = 500, ...params) {
    return res.status(code).send(getErrorText(name, ...params));
}

function getErrorText(name, ...rest) {
    return printf(config.errors[name], ...rest);
}

function getFirstMissingProperty(object, properties) {
    return (Array.isArray(properties) ? properties : [properties]).find(
        param => !object[param]
    );
}

function bool(x) {
    return !RE_FALSE.test(String(x).trim());
}

module.exports = {
    getPath,
    generateRefreshToken,
    printf,
    redirectWithError,
    replyWithError,
    getErrorText,
    getFirstMissingProperty,
    htmlEncode,
    bool
};