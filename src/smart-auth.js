const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router = require("express").Router({mergeParams: true});
const request = require('request');
const config = require('./config');
const sandboxify = require("./sandboxify");

module.exports = router;

//TODO: error handling for missing params here would be a lovely addition
router.get("/ehrlaunch", function(req, res) {

	var launchId = {context: {
		need_patient_banner: true,
		smart_style_url: config.baseUrl + "/smart-style.json"
	}};
	Object.keys(req.query).forEach( param => {
		if (["launch_url", "iss", "user", "sim_err"].indexOf(param) == -1)
			launchId.context[param] = req.query[param];
	});
	if (req.query.user) launchId.user = req.query.user;
	if (req.query.sim_err) launchId.sim_err = req.query.sim_err;
	var url = req.query.launch_url + 
		"?launch=" + Buffer.from(JSON.stringify(launchId)).toString("base64") +
		"&iss=" + encodeURIComponent(req.query.iss);
	res.redirect(url);
});

router.get("/authorize", function (req, res) {
	const apiUrl = sandboxify.buildUrlPath(config.baseUrl, req.baseUrl.replace(config.authBaseUrl, config.fhirBaseUrl));
	if (sandboxify.normalizeUrl(req.query.aud) != sandboxify.normalizeUrl(apiUrl)) {
		console.log("Bad AUD value: " + req.query.aud + " (expecting " + apiUrl);
		return res.send("Bad audience value", 400);
	}
	var launch = req.query.launch ? JSON.parse(Buffer.from(req.query.launch, 'base64').toString()) : {};  
	var code = {
		context: launch.context || {},
		client_id: req.query.client_id,
		scope: req.query.scope,
		user: launch.user
	};
	var state = req.query.state;
	var signedCode = jwt.sign(code, config.jwtSecret, { expiresIn: "5m" });
	res.redirect(req.query.redirect_uri + ("?code=" + signedCode + "&state=" + state));
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
		return res.status(401).send("invalid token");
	}

	if (code.scope.indexOf('offline_access') >= 0) {
		code.context['refresh_token'] = jwt.sign(code, config.jwtSecret);
	}

	var token = Object.assign({}, code.context, {
		token_type: "bearer",
		expires_in: 3600,
		scope: code.scope,
		client_id: req.body.client_id
	});
	
	//TODO: verification of id token doesn't work
	//TODO: only include profile if scope is requested
	if (code.user && code.scope.indexOf("profile") && code.scope.indexOf("openid")) {
		token.id_token = jwt.sign({
			profile: code.user,
			aud: req.body.client_id,
			iss: config.baseUrl
		}, config.oidcKey, "RS512");
	}
	token.access_token = jwt.sign(token, config.jwtSecret, { expiresIn: "1h" });
	res.json(token);
});
