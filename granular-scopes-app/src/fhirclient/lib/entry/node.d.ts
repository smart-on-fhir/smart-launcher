/// <reference types="node" />
import { IncomingMessage, ServerResponse } from "http";
import { fhirclient } from "../types";
declare type storageFactory = (options?: fhirclient.JsonObject) => fhirclient.Storage;
declare function smart(request: IncomingMessage, response: ServerResponse, storage?: fhirclient.Storage | storageFactory): fhirclient.SMART;
declare namespace smart {
    var AbortController: {
        new (): AbortController;
        prototype: AbortController;
    };
}
export = smart;
