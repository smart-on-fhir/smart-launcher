const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router = require("express").Router({mergeParams: true});
const request = require('request');
const config = require('./config');
const sandboxify = require("./sandboxify");

module.exports = router;

router.get("/authorize", function (req, res) {
	
	const requiredParams = ["response_type", "client_id", "redirect_uri", "scope", "state", "aud"];
	const missingParam = requiredParams.find( param => {
		if (!req.query[param]) return param;
	});
	if (missingParam) return res.send(`Missing ${missingParam} parameter`, 400);
	
	let sim = {};
	if (req.query.launch || req.params.sim) {
		sim = JSON.parse(Buffer.from(req.query.launch || req.params.sim, 'base64').toString());
	}

	//simulate errors if requested
	if (sim.auth_error == "auth_invalid_client_id") {
		return res.send("Invalid client_id parameter", 400);
	} else if (sim.auth_error == "auth_invalid_client_id") {
		return res.send("Invalid redirect_uri parameter", 400);
	} else if (sim.auth_error == "auth_invalid_scope") {
		return res.send("Invalid invalid_scope parameter", 400);
	}

	//look for a real error
	const apiUrl = sandboxify.buildUrlPath(config.baseUrl, req.baseUrl.replace(config.authBaseUrl, config.fhirBaseUrl));
	if (sandboxify.normalizeUrl(req.query.aud) != sandboxify.normalizeUrl(apiUrl)) {
		// console.log("Bad AUD value: " + req.query.aud + " (expecting " + apiUrl);
		return res.send("Bad audience value", 400);
	}

	//handle response from picker, login or auth screen
	if (req.query.patient) sim.patient = req.query.patient;
	if (req.query.provider) sim.provider = req.query.provider;
	if (req.query.auth_success) sim.skip_auth = "1";
	if (req.query.auth_fail) {
		return res.send("Unauthorized", 401);
	}
	
	//show patient picker if provider launch, patient scope and no patient or multiple patients provided
	if (!sim.launch_pt && req.query.scope.indexOf("patient") != -1 && (!sim.patient || sim.patient.indexOf(",") > -1)) {
		let redirectUrl = req.originalUrl.replace( config.authBaseUrl + "/authorize", "/picker")  + 
			(sim.patient ? "&patient=" + encodeURIComponent(sim.patient)  : "")
		return res.redirect(redirectUrl)

	//show login screen if patient launch and skip login is not selected, there's no patient or multiple patients provided
	} else if (sim.launch_pt && (!sim.skip_login || !sim.patient || sim.patient.indexOf("," > -1))) {
		console.log("PATIENT LOGIN SCREEN", sim.patient)

	//show login screen if provider launch and skip login is not selected, there's no provider or multiple provider provided
	} else if (sim.launch_prov && (!sim.skip_login || !sim.provider || sim.provider.indexOf("," > -1)) ) {
		console.log("PROVIDER LOGIN SCREEN", sim.patient)

	//show authorize screen if standalone launch and skip auth is not specified
	} else if (!sim.skip_auth && (sim.launch_prov || sim.launch_pt)) {
		console.log("App AUTH SCREEN")
	}

	var code = {
		context: {
			need_patient_banner: sim.sim_ehr ? false : true,
			smart_style_url: config.baseUrl + "/smart-style.json",
		},
		client_id: req.query.client_id,
		scope: req.query.scope,
	};

	Object.keys(sim).forEach( param => {
		if (["patient", "encounter"].indexOf(param) != -1) {
			code.context[param] = sim[param];
		} else {
			code[param] = sim[param];
		}
	});

	var signedCode = jwt.sign(code, config.jwtSecret, { expiresIn: "5m" });

	//TODO: wrap redirect in a qs with patient_id and provider_id if sim_ehr is specified
	//this should open in ehr.html and which should then send an iframe to the real redirect url

	res.redirect( req.query.redirect_uri + ("?code=" + signedCode + "&state=" + encodeURIComponent(req.query.state)) );
});

router.post("/token", bodyParser.urlencoded({ extended: false }), function (req, res) {
	
	var grantType = req.body.grant_type;
	var codeRaw;

	if (grantType === 'authorization_code') {
		codeRaw = req.body.code;
	} else if (grantType === 'refresh_token') {
		codeRaw = req.body.refresh_token;
	}

	try {
		var code = jwt.verify(codeRaw, config.jwtSecret);
	} catch (e) {
		return res.send("Invalid token", 401);
	}


	if (code.scope.indexOf('offline_access') >= 0) {
		code.context['refresh_token'] = jwt.sign(code, config.jwtSecret);
	}

	if (code.auth_error == "token_invalid_token") {
		return res.send("Invalid token", 401);
	}

	var token = Object.assign({}, code.context, {
		token_type: "bearer",
		expires_in: 3600,
		scope: code.scope,
		client_id: req.body.client_id
	});
	
	if (code.auth_error == "request_invalid_token") {
		token.sim_error = "Invalid token";
	} else if (code.auth_error == "request_expired_token") {
		token.sim_error = "Token expired";
	}

	if (code.user && code.scope.indexOf("profile") && code.scope.indexOf("openid")) {
		token.id_token = jwt.sign({
			profile: "Practitioner/" + code.user,
			aud: req.body.client_id,
			iss: config.baseUrl
		}, config.oidcKeypair.d, config.oidcKeypair.alg);
	}

	// console.log(JSON.stringify(token, null, 2));

	token.access_token = jwt.sign(token, config.jwtSecret, { expiresIn: "1h" });
	res.json(token);
});
