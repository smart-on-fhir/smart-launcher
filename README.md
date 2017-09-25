SMART/FHIR proxy server and app launcher

Goals:
- Awesome development and testing environment for SMART apps
- Easy to install and run on a local machine
- Private datasets for individual
- Save and share launch simulations
- Hackable for experimentation

Non-Goals:
- Reference / production implementation of SMART

Features:
- Works with any JSON FHIR server
- Virtual private sandboxes via URL parameter
	- http://localhost:3055/v/r3/fhir/Patient (not sandboxed) 
	- http://localhost:3055/v/r3/sb/empty-sandbox/fhir/Patient (empty sandbox) 
	- http://localhost:3055/v/r3/sb/empty-sandbox,smart-7-2017/fhir/Patient (intersect of sandboxes, with the first as read/write and the second as read only)
- Support for multiple FHIR versions
- Mock auth and OIDC
- Configurable auth errors
- Standalone launch simulations

TODO:
[ ] integrate authorize.html into smart-auth.js
[ ] integrate login.html into smart-auth.js
[ ] index.html UI
	[ ] integrate patient browser component
		- should be distributed with project, but serving a compiled version out of public is fine
		- should retain ability for users to manually enter ids as comma delimited text
		- should use server url created in top portion of page
	[ ] very simple picker component for providers
		- should retain ability for users to manually enter ids as comma delimited text
		- paging is not required - can just show the first ten by update date
	[ ] very simple picker component for encounters
		- paging is not required - can just show the ten most recent
	[ ] can transition from jquery to react, but only if code gets complicated
[ ] move common code from index.html, picker.html, authorize.html, login.html into util.js
	- esp. things like reading the qs and building the redirect urls
	- ideally, would like to keep these loosely coupled (via redirects) and simple 
	- remove underscore.js requirement, try to keep to just jquery
[ ] ehr.html UI
	- match hspc embedded launch ui (fake side menu, top bar)
	- add user and patient info to frame
[ ] unit tests for login flows / token acquisition and refresh
[ ] verify that OIDC signature algorithm works correctly
[ ] unit tests for sandboxify module
[ ] test with command line HAPI Java server and Mitre Go server
[ ] package with command line HAPI, node and sample data in Docker container
[ ] move code to public repo
[ ] support for backend services authentication spec
[ ] support for dynamic client registration (mock)
[ ] performance improvements
[ ] enforce scopes
[ ] XML support
