declare module "abortcontroller-polyfill/dist/cjs-ponyfill" {
    const AbortController: {
        new (): AbortController;
        prototype: AbortController;
    };
}
declare module "abortcontroller-polyfill/dist/abortcontroller-polyfill-only" {
    const AbortController: {
        new (): AbortController;
        prototype: AbortController;
    };
}
