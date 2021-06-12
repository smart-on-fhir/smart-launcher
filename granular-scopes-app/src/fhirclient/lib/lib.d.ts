import { fhirclient } from "./types";
declare const _debug: any;
export { _debug as debug };
/**
 * A namespace with functions for converting between different measurement units
 */
export declare const units: {
    cm({ code, value }: fhirclient.CodeValue): number;
    kg({ code, value }: fhirclient.CodeValue): number;
    any(pq: fhirclient.CodeValue): number;
};
/**
 * Used in fetch Promise chains to reject if the "ok" property is not true
 */
export declare function checkResponse(resp: Response): Promise<Response>;
/**
 * Used in fetch Promise chains to return the JSON version of the response.
 * Note that `resp.json()` will throw on empty body so we use resp.text()
 * instead.
 */
export declare function responseToJSON(resp: Response): Promise<object | string>;
/**
 * This is our built-in request function. It does a few things by default
 * (unless told otherwise):
 * - Makes CORS requests
 * - Sets accept header to "application/json"
 * - Handles errors
 * - If the response is json return the json object
 * - If the response is text return the result text
 * - Otherwise return the response object on which we call stuff like `.blob()`
 */
export declare function request<T = Response | fhirclient.JsonObject | string>(url: string | Request, options?: RequestInit): Promise<T>;
/**
 * Makes a request using `fetch` and stores the result in internal memory cache.
 * The cache is cleared when the page is unloaded.
 * @param url The URL to request
 * @param requestOptions Request options
 * @param force If true, reload from source and update the cache, even if it has
 * already been cached.
 */
export declare function getAndCache(url: string, requestOptions?: RequestInit, force?: boolean): Promise<any>;
/**
 * Fetches the conformance statement from the given base URL.
 * Note that the result is cached in memory (until the page is reloaded in the
 * browser) because it might have to be re-used by the client
 * @param baseUrl The base URL of the FHIR server
 * @param [requestOptions] Any options passed to the fetch call
 */
export declare function fetchConformanceStatement(baseUrl?: string, requestOptions?: RequestInit): Promise<fhirclient.FHIR.CapabilityStatement>;
/**
 * Given a response object, generates and throws detailed HttpError.
 * @param resp The `Response` object of a failed `fetch` request
 */
export declare function humanizeError(resp: Response): Promise<void>;
/**
 * Walks through an object (or array) and returns the value found at the
 * provided path. This function is very simple so it intentionally does not
 * support any argument polymorphism, meaning that the path can only be a
 * dot-separated string. If the path is invalid returns undefined.
 * @param obj The object (or Array) to walk through
 * @param path The path (eg. "a.b.4.c")
 * @returns {*} Whatever is found in the path or undefined
 */
export declare function getPath(obj: fhirclient.JsonObject, path?: string): any;
/**
 * Like getPath, but if the node is found, its value is set to @value
 * @param obj The object (or Array) to walk through
 * @param path The path (eg. "a.b.4.c")
 * @param value The value to set
 * @param createEmpty If true, create missing intermediate objects or arrays
 * @returns The modified object
 */
export declare function setPath(obj: fhirclient.JsonObject, path: string, value: any, createEmpty?: boolean): fhirclient.JsonObject;
/**
 * If the argument is an array returns it as is. Otherwise puts it in an array
 * (`[arg]`) and returns the result
 * @param arg The element to test and possibly convert to array
 * @category Utility
 */
export declare function makeArray<T = any>(arg: any): T[];
/**
 * Given a path, converts it to absolute url based on the `baseUrl`. If baseUrl
 * is not provided, the result would be a rooted path (one that starts with `/`).
 * @param path The path to convert
 * @param baseUrl The base URL
 */
export declare function absolute(path: string, baseUrl?: string): string;
/**
 * Generates random strings. By default this returns random 8 characters long
 * alphanumeric strings.
 * @param strLength The length of the output string. Defaults to 8.
 * @param charSet A string containing all the possible characters.
 *     Defaults to all the upper and lower-case letters plus digits.
 * @category Utility
 */
export declare function randomString(strLength?: number, charSet?: string): string;
/**
 * Decodes a JWT token and returns it's body.
 * @param token The token to read
 * @param env An `Adapter` or any other object that has an `atob` method
 * @category Utility
 */
export declare function jwtDecode(token: string, env: fhirclient.Adapter): fhirclient.JsonObject | null;
/**
 * Given a token response, computes and returns the expiresAt timestamp.
 * Note that this should only be used immediately after an access token is
 * received, otherwise the computed timestamp will be incorrect.
 * @param tokenResponse
 * @param env
 */
export declare function getAccessTokenExpiration(tokenResponse: fhirclient.TokenResponse, env: fhirclient.Adapter): number;
/**
 * Groups the observations by code. Returns a map that will look like:
 * ```js
 * const map = client.byCodes(observations, "code");
 * // map = {
 * //     "55284-4": [ observation1, observation2 ],
 * //     "6082-2": [ observation3 ]
 * // }
 * ```
 * @param observations Array of observations
 * @param property The name of a CodeableConcept property to group by
 */
export declare function byCode(observations: fhirclient.FHIR.Observation | fhirclient.FHIR.Observation[], property: string): fhirclient.ObservationMap;
/**
 * First groups the observations by code using `byCode`. Then returns a function
 * that accepts codes as arguments and will return a flat array of observations
 * having that codes. Example:
 * ```js
 * const filter = client.byCodes(observations, "category");
 * filter("laboratory") // => [ observation1, observation2 ]
 * filter("vital-signs") // => [ observation3 ]
 * filter("laboratory", "vital-signs") // => [ observation1, observation2, observation3 ]
 * ```
 * @param observations Array of observations
 * @param property The name of a CodeableConcept property to group by
 */
export declare function byCodes(observations: fhirclient.FHIR.Observation | fhirclient.FHIR.Observation[], property: string): (...codes: string[]) => any[];
/**
 * Given a conformance statement and a resource type, returns the name of the
 * URL parameter that can be used to scope the resource type by patient ID.
 */
export declare function getPatientParam(conformance: fhirclient.FHIR.CapabilityStatement, resourceType: string): string;
/**
 * Resolves a reference to target window. It may also open new window or tab if
 * the `target = "popup"` or `target = "_blank"`.
 * @param target
 * @param width Only used when `target = "popup"`
 * @param height Only used when `target = "popup"`
 */
export declare function getTargetWindow(target: fhirclient.WindowTarget, width?: number, height?: number): Promise<Window>;
