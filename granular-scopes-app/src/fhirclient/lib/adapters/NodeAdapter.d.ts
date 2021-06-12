/// <reference types="node" />
import { fhirclient } from "../types";
import { IncomingMessage, ServerResponse } from "http";
interface NodeAdapterOptions {
    request: IncomingMessage;
    response: ServerResponse;
    storage?: fhirclient.Storage | fhirclient.storageFactory;
}
/**
 * Node Adapter - works with native NodeJS and with Express
 */
export default class NodeAdapter implements fhirclient.Adapter {
    /**
     * Holds the Storage instance associated with this instance
     */
    protected _storage: fhirclient.Storage | null;
    /**
     * Environment-specific options
     */
    options: NodeAdapterOptions;
    /**
     * @param options Environment-specific options
     */
    constructor(options: NodeAdapterOptions);
    /**
     * Given a relative path, returns an absolute url using the instance base URL
     */
    relative(path: string): string;
    /**
     * Returns the protocol of the current request ("http" or "https")
     */
    getProtocol(): string;
    /**
     * Given the current environment, this method must return the current url
     * as URL instance. In Node we might be behind a proxy!
     */
    getUrl(): URL;
    /**
     * Given the current environment, this method must redirect to the given
     * path
     * @param location The path to redirect to
     */
    redirect(location: string): void;
    /**
     * Returns a ServerStorage instance
     */
    getStorage(): fhirclient.Storage;
    /**
     * Base64 to ASCII string
     */
    btoa(str: string): string;
    /**
     * ASCII string to Base64
     */
    atob(str: string): string;
    /**
     * Returns a reference to the AbortController constructor. In browsers,
     * AbortController will always be available as global (native or polyfilled)
     */
    getAbortController(): {
        new (): AbortController;
        prototype: AbortController;
    };
    /**
     * Creates and returns adapter-aware SMART api. Not that while the shape of
     * the returned object is well known, the arguments to this function are not.
     * Those who override this method are free to require any environment-specific
     * arguments. For example in node we will need a request, a response and
     * optionally a storage or storage factory function.
     */
    getSmartApi(): fhirclient.SMART;
}
export {};
