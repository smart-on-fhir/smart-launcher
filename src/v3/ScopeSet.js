"use strict";
exports.__esModule = true;
/**
 * This class tries to make it easier and cleaner to work with scopes (mostly by
 * using the two major methods - "has" and "matches").
 */
var ScopeSet = /** @class */ (function () {
    /**
     * Parses the input string (if any) and initializes the private state vars
     */
    function ScopeSet(str) {
        if (str === void 0) { str = ""; }
        this._scopesString = String(str).trim();
        this._scopes = this._scopesString.split(/\s+/).filter(Boolean);
    }
    /**
     * Checks if there is a scope that matches exactly the given string
     * @param scope The scope to look for
     */
    ScopeSet.prototype.has = function (scope) {
        return this._scopes.indexOf(scope) > -1;
    };
    /**
     * Checks if there is a scope that matches by RegExp the given string
     * @param scopeRegExp The pattern to look for
     */
    ScopeSet.prototype.matches = function (scopeRegExp) {
        return this._scopesString.search(scopeRegExp) > -1;
    };
    /**
     * Adds new scope to the set unless it already exists
     * @param scope The scope to add
     * @returns true if the scope was added and false otherwise
     */
    ScopeSet.prototype.add = function (scope) {
        if (this.has(scope)) {
            return false;
        }
        this._scopes.push(scope);
        this._scopesString = this._scopes.join(" ");
        return true;
    };
    /**
     * Removes a scope to the set unless it does not exist.
     * @param scope The scope to remove
     * @returns true if the scope was removed and false otherwise
     */
    ScopeSet.prototype.remove = function (scope) {
        var index = this._scopes.indexOf(scope);
        if (index < 0) {
            return false;
        }
        this._scopes.splice(index, 1);
        this._scopesString = this._scopes.join(" ");
        return true;
    };
    /**
     * Converts the object to string which is the space-separated list of scopes
     */
    ScopeSet.prototype.toString = function () {
        return this._scopesString;
    };
    /**
     * Converts the object to JSON which is an arrays of scope strings
     */
    ScopeSet.prototype.toJSON = function () {
        return this._scopes;
    };
    /**
     * Checks if the given scopes string is valid for use by backend services.
     * This will only accept system scopes and will also reject empty scope.
     * @param scopes The scopes to check
     * @returns The invalid scope or empty string on success
     * @static
     */
    ScopeSet.getInvalidSystemScopes = function (scopes) {
        scopes = String(scopes || "").trim();
        return scopes.split(/\s+/).find(function (s) { return !(/^system\/(\*|[A-Z][a-zA-Z]+)(\.(read|write|\*))?$/.test(s)); }) || "";
    };
    return ScopeSet;
}());
exports["default"] = ScopeSet;
