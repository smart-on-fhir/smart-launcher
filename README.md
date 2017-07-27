An exparimental SMART/FHIR proxy server

Features:
- Works with any JSON FHIR server
- Virtual private sandboxes via URL parameter
	- http://localhost:3055/r3/sb/empty-sandbox/fhir/Patient (no data) 
	- http://localhost:3055/r3/sb/empty-sandbox,smart-7-2017/fhir/Patient (intersect of sandboxes, with the first as read/write and the second as read only)
- Support for multiple FHIR versions
- Mock auth and OIDC
- Configurable auth errors
- Standalone launch simulations (TODO)

TODO:
- Unit test sandboxify module
- Better error handling throughout (ie missing required parameters)
- Pass on-demand errors to auth for testing
- OIDC should follow requested scopes
- Support validation of OIDC id_token (.well-known)
- Enforce scopes
- Better launch GUI with patient and provider selectors
- Launcher GUI should use url params as source of truth so can bookmark a launch
- Pop picker for launch/patient scope when no patient
- Support standalone launch (stash params in resource and cache in memory, pass id in sim param of url string)
- Support optional login dialog for standalone launch (username is FHIR path eg. Patient/123 and password can be anything)
- XML support
- Performance improvements