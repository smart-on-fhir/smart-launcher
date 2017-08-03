const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const router = require("express").Router({mergeParams: true});
const request = require('request');
const config = require('./config');
const sandboxify = require("./sandboxify");

module.exports = router;

router.get("/authorize", function (req, res) {
	let sim = {};
	if (req.query.launch || req.params.sim) {
		sim = JSON.parse(Buffer.from(req.query.launch || req.params.sim, 'base64').toString());
	}

	const apiUrl = sandboxify.buildUrlPath(config.baseUrl, req.baseUrl.replace(config.authBaseUrl, config.fhirBaseUrl));
	if (sandboxify.normalizeUrl(req.query.aud) != sandboxify.normalizeUrl(apiUrl)) {
		console.log("Bad AUD value: " + req.query.aud + " (expecting " + apiUrl);
		return res.send("Bad audience value", 400);
	}

	var code = {
		context: {
			need_patient_banner: true,
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
	// console.log(JSON.stringify(code, null, 2));

	var signedCode = jwt.sign(code, config.jwtSecret, { expiresIn: "5m" });
	res.redirect(req.query.redirect_uri + ("?code=" + signedCode + "&state=" + req.query.state));
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
