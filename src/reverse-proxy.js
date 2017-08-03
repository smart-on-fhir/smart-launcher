const request = require("request");
const jwt = require("jsonwebtoken");
const config = require("./config");
const fhirError = require("./fhir-error");
const sandboxify = require("./sandboxify");

module.exports = function (req, res) {

	let token = null;
	let sandboxes = req.params.sandbox && req.params.sandbox.split(".");
	let fhirServer = config["fhirServer" + req.params.fhir_release.toUpperCase()];
	if (!fhirServer) res.status(400).send({ error: `FHIR server ${req.params.fhir_release} not found` })

	//only allow gets to blacklisted sandboxes (like the SMART default patients)
	if (req.method != "GET" && (
		!sandboxes ||
		config.protectedSandboxWords.find( w => sandboxes[0].toLowerCase().indexOf(w) != -1 )
	)) {
		return res.status(401).send( fhirError("You do not have permission to modify this sandbox") );
	}

	//require a valid auth token if there is an auth token
	if (req.headers.authorization) {
		try {
			token = jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret);
		} catch (e) {
			return res.send("Invalid token", 401);
		}
		if (token.sim_error) return res.send(token.sim_error, 401);

	}

	//set everything to JSON since we don't currently don't support XML and block XML requests at a middleware layer
	let fhirRequest = {
		headers: {"content-type":"application/json",  "accept":"application/json+fhir"},
		method: req.method
	}
	
	//inject sandbox tag into POST and PUT requests and make urls conditional
	if (Object.keys(req.body).length) {
		fhirRequest.body = sandboxify.adjustRequestBody(req.body, config.sandboxTagSystem, sandboxes);
		fhirRequest.body = Buffer.from(JSON.stringify(fhirRequest.body), 'utf8');
		fhirRequest.headers['content-length'] = Buffer.byteLength(fhirRequest.body)
	}

	//make urls conditional and if exists, change /id to ?_id=
	fhirRequest.url = sandboxify.buildUrlPath(
		fhirServer, sandboxify.adjustUrl(req.url, req.method == "GET", sandboxes)
	);

	//proxy the request to the real FHIR server
	console.log("PROXY: " + fhirRequest.url);
	request(fhirRequest, function(error, response, body) {
		res.status(response.statusCode);
		res.type(response.headers['content-type']);
	 
		//adjust urls in the fhir response so future requests will hit the proxy
		if (body) {
			let requestUrl = sandboxify.buildUrlPath(config.baseUrl, req.originalUrl);
			let requestBaseUrl = sandboxify.buildUrlPath(config.baseUrl, req.baseUrl)
			body = sandboxify.adjustResponseUrls(body, fhirRequest.url, requestUrl, fhirServer, requestBaseUrl);
		}

		//special handler for metadata requests - inject the SMART information
		if (req.url == "/metadata" && response.statusCode == 200 && body.indexOf("fhirVersion") != -1) {
			let authBaseUrl = sandboxify.buildUrlPath(config.baseUrl, req.baseUrl.replace(config.fhirBaseUrl, config.authBaseUrl));
			body = sandboxify.addAuthToConformance(body, authBaseUrl);
			if (!body) {
				res.status(404);
				body = fhirError(`Error reading server metadata`);
			}
		}

		//pull the resource out of the bundle if we converted a /id url into a ?_id= query
		if (req.method =="GET" && /([A-Z]\w+)(\/([^\/?]+))\/?(\?|$)/.test(req.url) && body.indexOf("Bundle") != -1) {
			body = sandboxify.unbundleResource(body);
			if (!body) {
				res.status(404);
				body = fhirError(`Resource ${req.url.slice(1)} is not known`);
			}
		}

		//pretty print if called from a browser
		//TODO: use a template and syntax highlight json response
		if (req.headers.accept.toLowerCase().indexOf("html") > -1 && req.originalUrl.toLowerCase().indexOf("_pretty=false") == -1) {
			body = `<html><body><pre>${typeof body == "string" ? body : JSON.stringify(body, null, 2)}</pre></body></html>`;
			res.type("html");
		}

		res.send(body);
	});
	
};
