import { fhirclient } from "./types";
export default class HttpError extends Error {
    /**
     * The HTTP status code for this error
     */
    statusCode: number;
    /**
     * The HTTP status code for this error.
     * Note that this is the same as `status`, i.e. the code is available
     * through any of these.
     */
    status: number;
    /**
     * The HTTP status text corresponding to this error
     */
    statusText: string;
    /**
     * The parsed response body. Can be an OperationOutcome resource, s JSON
     * object, a string or null.
     */
    body: fhirclient.JsonObject | string | null;
    constructor(message?: string, statusCode?: number, statusText?: string, body?: fhirclient.JsonObject | string | null);
    toJSON(): {
        name: string;
        statusCode: number;
        status: number;
        statusText: string;
        message: string;
        body: string | fhirclient.JsonObject;
    };
}
