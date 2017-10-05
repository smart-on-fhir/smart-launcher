const request = require("request");
const jwt = require("jsonwebtoken");
const config = require("./config");
const fhirError = require("./fhir-error");
const sandboxify = require("./sandboxify");
const patientMap = require("./patient-compartment.json")

module.exports = function (req, res) {

	let token = null;
	let sandboxes = req.params.sandbox && req.params.sandbox.split(",");
	let isSearchPost = req.method == "POST" && req.url.endsWith("/_search");

	let fhirServer = config["fhirServer" + req.params.fhir_release.toUpperCase()];
	if (!fhirServer) {
		return res.status(400).send({
			error: `FHIR server ${req.params.fhir_release} not found`
		});
	}

	// only allow gets to blacklisted sandboxes (like the SMART default patients)
	if (req.method != "GET" && !req.url.endsWith("/_search") && (
		!sandboxes ||
		config.protectedSandboxWords.find( w => sandboxes[0].toLowerCase().indexOf(w) != -1 )
	)) {
		return res.status(401).send( fhirError("You do not have permission to modify this sandbox") );
	}

	// require a valid auth token if there is an auth token
	if (req.headers.authorization) {
		try {
			token = jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret);
		} catch (e) {
			return res.status(401).send("Invalid token");
		}
		if (token.sim_error) {
			return res.status(401).send(token.sim_error);
		}
	}

	// set everything to JSON since we don't currently support XML and block XML
	// requests at a middleware layer
	let fhirRequest = {
		headers: {
			"content-type": "application/json",
			"accept"      :"application/json+fhir"
		},
		method: req.method
	}
	
	// inject sandbox tag into POST and PUT requests and make urls conditional
	// -------------------------------------------------------------------------
	if (isSearchPost) {
		fhirRequest.body = req.body;
		fhirRequest.headers["content-type"] = req.headers["content-type"];
		// fhirRequest.body = String(fhirRequest.body) + "&_tag=" + sandboxes.join("&");
	}
	else if (Object.keys(req.body).length) {
		fhirRequest.body = sandboxify.adjustRequestBody(req.body, config.sandboxTagSystem, sandboxes);
		fhirRequest.body = Buffer.from(JSON.stringify(fhirRequest.body), 'utf8');
		fhirRequest.headers['content-length'] = Buffer.byteLength(fhirRequest.body)
	}

	// make urls conditional and if exists, change /id to ?_id=
	if (isSearchPost) {
		fhirRequest.url = sandboxify.buildUrlPath(
			fhirServer, req.url
		);
	}
	else {
		fhirRequest.url = sandboxify.buildUrlPath(
			fhirServer, sandboxify.adjustUrl(req.url, req.method == "GET", sandboxes)
		);
	}

	//if applicable, apply patient scope to GET requests, largely for performance reasons.
	//Full scope support can't be implemented in a proxy because it would require "or"
	//conditions in FHIR API calls (ie ), but should do better than this!
	let scope = (token && token.scope) || req.headers["x-scope"];
	let patient = (token && token.patient) || req.headers["x-patient"];
	if (req.method == "GET" && scope && patient && scope.indexOf("user/") == -1) {
		let resourceType = req.url.slice(1);
		let map = patientMap[req.params.fhir_release] && patientMap[req.params.fhir_release][resourceType];
		if (map) fhirRequest.url += "&" + map + "=" + patient;
	}

	//proxy the request to the real FHIR server
	if (process.env.NODE_ENV == "development") {
		console.log("PROXY: " + fhirRequest.url, fhirRequest);
	}

	request(fhirRequest, function(error, response, body) {
		if (error) {
			// res.status(500)
			// res.type("application/json")
			return res.send(JSON.stringify(error, null, 4));
		}
		res.status(response.statusCode);
		res.type(response.headers['content-type']);
	 
		// adjust urls in the fhir response so future requests will hit the proxy
		if (body) {
			let requestUrl = sandboxify.buildUrlPath(config.baseUrl, req.originalUrl);
			let requestBaseUrl = sandboxify.buildUrlPath(config.baseUrl, req.baseUrl)
			body = sandboxify.adjustResponseUrls(body, fhirRequest.url, requestUrl, fhirServer, requestBaseUrl);
		}

		// special handler for metadata requests - inject the SMART information
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

		// pretty print if called from a browser
		// TODO: use a template and syntax highlight json response
		if (req.headers.accept &&
			req.headers.accept.toLowerCase().indexOf("html") > -1 &&
			req.originalUrl.toLowerCase().indexOf("_pretty=false") == -1
		) {
			body = (typeof body == "string" ? body : JSON.stringify(body, null, 4));
			body = body .replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")
						.replace(/"/g, "&quot;");
			body = `<html><body><pre>${body}</pre></body></html>`;
			res.type("html");
		}
		
		res.send(body);
	});
	
};
