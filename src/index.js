const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require('morgan');
const bodyParser = require('body-parser');
const smartAuth = require("./smart-auth");
const reverseProxy = require("./reverse-proxy");
const config = require("./config");
const fhirError = require("./fhir-error");

const handleParseError = function(err, req, res, next) {
	if (err instanceof SyntaxError && err.status === 400) {
		return res.status(400)
			.send( fhirError(`Failed to parse JSON content, error was: ${err.message}`) );
	} else {
		next(err, req, res);
	}
}

const handleXmlRequest = function(err, req, res, next) {
	if (
		req.headers.accept &&req.headers.accept.indexOf("xml") != -1 || 
		req.headers['content-type'] && req.headers['content-type'].indexOf("xml") != -1 ||
		/_format=.*xml/i.test(req.url)
	) {
		return res.status(400).send( fhirError("XML format is not supported") )
	} else {
		next(err, req, res)
	}
}

const app = express();

app.use(cors());
app.use(logger('combined'));

//reject xml
app.use(handleXmlRequest);

//auth request
app.use([
	"/:fhir_release/sb/:sandbox/sim/:sim" + config.authBaseUrl, 
	"/:fhir_release/sb/:sandbox" + config.authBaseUrl, 
	"/:fhir_release/sim/:sim" + config.authBaseUrl, 
	"/:fhir_release" + config.authBaseUrl
], smartAuth)

//fhir request
app.use(
	[
		"/:fhir_release/sb/:sandbox/sim/:sim" + config.fhirBaseUrl, 
		"/:fhir_release/sb/:sandbox" + config.fhirBaseUrl, 
		"/:fhir_release/sim/:sim" + config.fhirBaseUrl, 
		"/:fhir_release" + config.fhirBaseUrl
	],
	bodyParser.json({type: "*/*"}),
	handleParseError,
	reverseProxy
);

//static request
app.use(express.static('static'));

module.exports = app;

if (!module.parent) {
	app.listen(config.port);
	console.log("Proxy server running on localhost on port " + config.port);
}
