/**
 * This class tries to make it easier and cleaner to work with scopes (mostly by
 * using the two major methods - "has" and "matches").
 */
export default class ScopeSet
{
    private _scopesString: string

    private _scopes: string[]

    /**
     * Parses the input string (if any) and initializes the private state vars
     */
    constructor(str = "") {
        this._scopesString = String(str).trim();
        this._scopes = this._scopesString.split(/\s+/).filter(Boolean);
    }

    /**
     * Checks if there is a scope that matches exactly the given string
     * @param scope The scope to look for
     */
    has(scope: string): boolean {
        return this._scopes.indexOf(scope) > -1;
    }

    /**
     * Checks if there is a scope that matches by RegExp the given string
     * @param scopeRegExp The pattern to look for
     */
    matches(scopeRegExp: RegExp): boolean {
        return this._scopesString.search(scopeRegExp) > -1;
    }

    /**
     * Adds new scope to the set unless it already exists
     * @param scope The scope to add
     * @returns true if the scope was added and false otherwise
     */
    add(scope: string): boolean {
        if (this.has(scope)) {
            return false;
        }

        this._scopes.push(scope);
        this._scopesString = this._scopes.join(" ");
        return true;
    }

    /**
     * Removes a scope to the set unless it does not exist.
     * @param scope The scope to remove
     * @returns true if the scope was removed and false otherwise
     */
    remove(scope: string): boolean {
        let index = this._scopes.indexOf(scope);
        if (index < 0) {
            return false;
        }
        this._scopes.splice(index, 1);
        this._scopesString = this._scopes.join(" ");
        return true;
    }

    /**
     * Converts the object to string which is the space-separated list of scopes
     */
    toString() {
        return this._scopesString;
    }

    /**
     * Converts the object to JSON which is an arrays of scope strings
     */
    toJSON() {
        return this._scopes;
    }

    /**
     * Checks if the given scopes string is valid for use by backend services.
     * This will only accept system scopes and will also reject empty scope.
     * @param scopes The scopes to check
     * @returns The invalid scope or empty string on success
     * @static
     */
    static getInvalidSystemScopes(scopes: string): string {
        scopes = String(scopes || "").trim();
        return scopes.split(/\s+/).find(s => !(
            /^system\/(\*|[A-Z][a-zA-Z]+)(\.(read|write|\*))?$/.test(s)
        )) || "";
    }
}
