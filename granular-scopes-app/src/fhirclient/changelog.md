# Changelog

## v2.3.10
- Fixed the way access token expiration is computed for non-jwt tokens (#101).
- Added a `body` property to the `HttpError` instances (#100). It will contain the parsed response body from failed requests which can be JSON (typically an `OperationOutcome` resource), a string or `null`.

## v2.3.8
- Changed the way the "auto-refresh" flow works. Before `2.3.8` the client was obtaining new access token if a request fails with `401`. Since `2.3.8`, the client will check the access token expiration time before making a request. This is done to avoid CORS-related issues with servers that do not emit CORS headers in case of error.
- The refresh token requests will now be sent without credentials. In the rare cases when the auth server requires the app to send cookies, developers will have to configure the client to do so.
- Added support for the `..` path operator in `client.getPath`, `client.getState` and the `resolveReferences` option of `client.request`. This was done to allow paths like `identifier..assigner`, which will match if identifier is an array of objects having an assigner reference property.

## v2.3.5
- The `completeInTarget` authorize option defaults to `true` if the app was loaded in an iframe
- The `redirectUri` option accepts absolute URLs and does not append "/" to them
- The `refresh` client method will now use basic authorization for confidential clients
- The `refresh` client method will now try to make its request both with and without credentials
- The `request` client method will now return the response object if the response status is 201 (can get the `location` header after create)
- Added the `getState` method of the `Client` for state introspections

## v2.3.1
- `client.create` and `client.update` are using `"Content-Type": "application/json"` header by default
- `client.create` and `client.update` alow custom `Content-Type` to be specified
- `node` and `hapi` type definitions are moved to peer dependencies to avoid build conflicts

## v2.3.0
- Added API documentation generated from source - http://docs.smarthealthit.org/client-js/typedoc/
- Added ability to authorize in different window or frame - http://docs.smarthealthit.org/client-js/targets.html
- Fixed a Hapi.js issue with detecting the protocol of the request #69

## v2.2.0
- Rewritten in TypeScript to improve readability and maintainability
- Fixed some build errors (#68)
- HapiJs users have new entry point `const smart = require("fhirclient/lib/entry/hapi")`
- Better code coverage
- Improved performance (#67)
- Added ability to [abort requests](http://docs.smarthealthit.org/client-js/client.html#aborting-requests)

## v2.1.1
- Switched to ES modules (thanks to @kherock)
- Updated type definitions to fix some issues with Angular projects
- other minor bug fixes

## v2.1.0
- Added convenience wrappers for the FHIR create/update/delete operations #56
- Added patient context aware request wrapper #57
- Fixed a refresh issue in Firefox #58
- Improved fake token flow #59
- Added `getFhirVersion` and `getFhirRelease` client methods
- Few other minor fixes and improvements

## v2.0.7
- See http://docs.smarthealthit.org/client-js/v2.html

## v0.1.15
- Included the last version of fhir.js
    - For previous page, bundle.link.relation can either   have 'previous' or 'prev' value
    - Added getBundleByUrl api method
    - Added support for `le` and `ge` search parameters
    - Added support for `_include` and `_revinclude`
- Added a warning if the launch URL is not loaded properly

## v0.1.14
- Fixed the structure of the released package broken in `0.1.13`. Only the `dist`
  folder is released now.

## v0.1.13
- The profile claim can be absolute URL
- Examples use existing server and patient ID
- Resolve all npm vulnerabilities by updating to the latest versions
- Switch -g to -t for varify to resolve build issues
- Update lib/jqFhir.js with the latest version from https://github.com/FHIR/fhir.js/tree/v0.0.21.
- Added the changelog file
