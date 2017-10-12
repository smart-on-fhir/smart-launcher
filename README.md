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
	- https://localhost:3055/v/r3/fhir/Patient (not sandboxed) 
	- https://localhost:3055/v/r3/sb/empty-sandbox/fhir/Patient (empty sandbox) 
	- https://localhost:3055/v/r3/sb/empty-sandbox,smart-7-2017/fhir/Patient (intersect of sandboxes, with the first as read/write and the second as read only)
- Support for multiple FHIR versions
- Mock auth and OIDC
- Configurable auth errors
- Standalone launch simulations
