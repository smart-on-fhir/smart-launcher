
const Request   = require('request');
const request   = require('supertest');
const app       = require("../src/index.js");
const config    = require("../src/config");
const jwt       = require("jsonwebtoken");
const Url       = require("url");
const jwkToPem  = require("jwk-to-pem");
const Codec     = require("../static/codec.js");
const base64url = require("base64-url");


const ENABLE_FHIR_VERSION_2  = true;
const ENABLE_FHIR_VERSION_3  = true;
const PREFERRED_FHIR_VERSION = ENABLE_FHIR_VERSION_3 ? "r3" : "r2";



////////////////////////////////////////////////////////////////////////////////

/**
 * Promisified version of request. Rejects with an Error or resolves with the
 * response (use response.body to access the parsed body).
 * @param {Object} options The request options
 * @return {Promise<Object>}
 */
function requestPromise(options) {
    return new Promise((resolve, reject) => {
        Request(
            Object.assign({}, options, { strictSSL: false }),
            (error, res, body) => {
                if (error) {
                    return reject(error);
                }
                resolve(res);
            }
        );
    });
}

/**
 * Throws an error if the response does not have the specified status code.
 * @param {Object} res Response
 * @param {Number} code The expected status code
 * @returns {void}
 * @throws {Error}
 */
function expectStatusCode(res, code) {
    if (res.statusCode !== code) {
        throw new Error(`Expecting status code of ${code} but received ${res.statusCode}`);
    }
}

/**
 * Throws an error if the response does not have the specified header.
 * The header name is required and the value is optional.
 * @param {Object} res The response
 * @param {String} name The name of the header
 * @param {String|RegExp} [value] The header value (checks for presence only if
 * this is missing)
 * @returns {void}
 * @throws {Error}
 */
function expectResponseHeader(res, name, value = null) {
    let header = String(res.headers[name.toLowerCase()] || "");
    if (!header) {
        throw new Error(`Expecting ${name} response header but it wasn't sent`);
    }
    if (value) {
        if (value instanceof RegExp) {
            if (!value.test(header)) {
                throw new Error(`The ${name} response header did not match the specified RegExp`);
            }
        }
        else if (header !== value) {
            throw new Error(`Expecting ${name} response header to equal ${value} but found ${header}`);
        }
    }
}

function lookupOidcKeys(done) {
    const path = `${config.baseUrl}/.well-known/openid-configuration/`;
    let keysLocation, keys;
    
    Request({
        url: path,
        json: true,
        strictSSL: false
    }, (error, res, body) => {
        if (error) {
            return done(error)
        }

        try {
            expectStatusCode(res, 200);
            expectResponseHeader(res, 'Content-Type', /^application\/json/);
            if (!body) {
                throw new Error(`${path} did not return a JSON`);
            }
            if (!body.jwks_uri) {
                throw new Error(`${path} did not return proper keys location`);
            }
        } catch(ex) {
            return done(ex);
        }

        Request({
            url: body.jwks_uri,
            json: true,
            strictSSL: false
        }, (error2, res2, body2) => {
            if (error2) {
                return done(error2)
            }
            
            try {
                expectStatusCode(res2, 200);
                expectResponseHeader(res, 'Content-Type', /^application\/json/);
                if (!body2) {
                    throw new Error(`${keysLocation} did not return a JSON`)
                }
                if (!body2.keys) {
                    throw new Error(`${keysLocation} did not return keys`);
                }
            } catch(ex) {
                return done(ex);
            }

            done(null, body2.keys);
        })
    });
}

/**
 * Encodes the object with our proprietary codec to make it smaller. The
 * serializes as JSON and returns a base64 version of it.
 * @param {Object} object The object to encode
 * @returns {String}
 */
function encodeSim(object = {}) {
    return new Buffer(
        JSON.stringify(Codec.encode(object))
    ).toString("base64");
}

/**
 * Makes the initial authorization request and expects the server to redirect
 * back to redirect_uri with the given state and a code.
 * @param {Object} options
 * @param {String} options.patient 0 or more comma-separated patient IDs.
 * Defaults to "x" because we ignore it.
 * @param {String} options.client_id The client_id of the app. Defaults to "x"
 * because we ignore it.
 * @param {String} options.redirect_uri The uri to redirect to. Defaults to
 * "http://x.y" because we ignore it but still require it to be valid URL.
 * @param {String} options.scope
 * @param {String} options.state
 * @param {String} options.aud
 * @param {Object} options.launch
 * @param {Number} options.launch.launch_pt 1 or 0
 * @param {Number} options.launch.skip_login 1 or 0
 * @param {Number} options.launch.skip_auth 1 or 0
 * @param {String} options.launch.patient
 * @param {String} options.launch.encounter
 * @param {String} options.launch.auth_error
 * @returns {Promise<String>} Returns a promise resolved with the code
 */
function getAuthCode(options) {
    return new Promise((resolve, reject) => {
        Request({
            url      : `${options.baseUrl}auth/authorize`,
            strictSSL: false,
            followRedirect: false,
            qs: {
                response_type: "code",
                patient      : options.patient   || "x",
                client_id    : options.client_id || "x",
                redirect_uri : options.redirect_uri || "http://x.y",
                scope        : options.scope || "x",
                state        : options.state || "x",
                launch       : encodeSim(options.launch),
                aud          : `${options.baseUrl}fhir`
            }
        }, (error, res, body) => {
            if (error) {
                return reject(error)
            }

            try {
                expectStatusCode(res, 302);

                if (!res.headers.location) {
                    throw new Error(`auth/authorize did not redirect to the redirect_uri`)
                }
                let url = Url.parse(res.headers.location, true);
                let code = url.query.code;
                if (!code) {
                    console.log(res.headers)
                    throw new Error(`auth/authorize did not redirect to the redirect_uri with code parameter`)
                }
                // console.log("code: ", JSON.parse(base64url.decode(code.split(".")[1])));
                resolve(code);
            } catch(ex) {
                reject(ex);
            }
        });
    });
}

function getAuthToken(options) {
    return new Promise((resolve, reject) => {
        Request({
            url      : `${options.baseUrl}auth/token`,
            method   : "POST",
            strictSSL: false,
            followRedirect: false,
            json: true,
            form: {
                grant_type: "authorization_code",
                code      : options.code
            }
        }, (error, res, body) => {
            if (error) {
                return reject(error)
            }

            try {
                expectStatusCode(res, 200);
                resolve(body);
            } catch(ex) {
                reject(ex);
            }
        });
    });
}

/**
 * Posts a refresh token to the token endpoint and resolves with the "new"
 * token response.
 * @param {Object} options
 * @param {String} options.baseUrl
 * @param {String} options.refreshToken
 * @returns {Promise<Object>}
 */
function refreshSession(options) {
    return requestPromise({
        url           : `${options.baseUrl}auth/token`,
        method        : "POST",
        followRedirect: false,
        json          : true,
        form: {
            grant_type   : "refresh_token",
            refresh_token: options.refreshToken
        }
    }).then(res => res.body);
}

function authorize(options) {
    return getAuthCode(options).then(
        code => getAuthToken({ code, baseUrl: options.baseUrl })
    );
}

function buildRoutePermutations(suffix = "", fhirVersion) {
    suffix = suffix.replace(/^\//, "");
    let out = [];
    
    if (ENABLE_FHIR_VERSION_3 && (!fhirVersion || fhirVersion == 3)) {
        out.push(
            `/v/r3/sb/abc/sim/whatever/${suffix}`, 
            `/v/r3/sb/abc/${suffix}`,
            `/v/r3/sim/whatever/${suffix}`,
            `/v/r3/${suffix}`
        );
    }

    if (ENABLE_FHIR_VERSION_2 && (!fhirVersion || fhirVersion == 2)) {
        out.push(
            `/v/r2/sb/abc/sim/whatever/${suffix}`, 
            `/v/r2/sb/abc/${suffix}`,
            `/v/r2/sim/whatever/${suffix}`,
            `/v/r2/${suffix}`
        );    
    }

    return out;
}

////////////////////////////////////////////////////////////////////////////////

before(() => {
    if (!app.listening) {
        app.listen(config.port);
    }
});

after(() => {
    if (app.listening) {
        app.close();
    }
});


describe('index', function() {
    it('responds with html', function(done) {
        request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });
    });

["picker", "login", "authorize"].forEach(endPoint => {
    describe(endPoint, function() {
        buildRoutePermutations(endPoint).forEach(path => {
            describe(`GET ${path}`, function() {
                it('responds with html', function(done) {
                    request(app)
                    .get(path)
                    .expect('Content-Type', /html/)
                    .expect(200, done);
                });
            });
        });
    });
});

describe('Proxy', function() {
    this.timeout(10000);
    buildRoutePermutations("fhir/metadata").forEach(path => {
        it(path + ' responds with html in browsers', done => {
            request(app)
            .get(path)
            .set('Accept', 'text/html')
            .expect('Content-Type', /^text\/html/)
            .expect(200, done);
        });

        // TODO: Support XML
        // it(path + ' responds with xml if requested', done => {
        //     request(app)
        //     .get(path)
        //     .set('Accept', 'application/xml')
        //     .expect('Content-Type', /^application\/xml\+fhir/)
        //     .expect(200, done);
        // });
    });

    it ("Validates the fhir version", done => {
        request(app)
        .get("/v/r300/fhir/metadata")
        .expect('Content-Type', /json/)
        .expect('{"error":"FHIR server r300 not found"}')
        .expect(400, done);
    });

    it ("If auth token is sent - validates it", done => {
        request(app)
        .get(`/v/${PREFERRED_FHIR_VERSION}/fhir/metadata`)
        .set("authorization", "Bearer whatever")
        .expect('Content-Type', /text/)
        .expect("JsonWebTokenError: jwt malformed")
        .expect(401, done);
    });

    it ("Can simulate custom token errors");
    it ("Keeps protected data-sets read-only");
    it ("Inject sandbox tag into POST and PUT requests");
    it ("Make urls conditional and if exists, change /id to ?_id=");
    it ("Apply patient scope to GET requests");

    it ("Adjust urls in the fhir response", done => {
        request(app)
        .get("/v/" + PREFERRED_FHIR_VERSION + "/fhir/Patient")
        .expect(res => {
            if (res.text.indexOf(config.fhirServerR3) > -1) {
                throw new Error("Not all URLs replaced");
            }
        })
        .end(done);
    });

    it ("Inject the SMART information in metadata responses");

    it ("pull the resource out of the bundle if we converted a /id url into a ?_id= query", done => {
        let patientID;

        // We cannot know any IDs but we need to use one for this test, thus
        // query all the patients with _count=1 to find the first one and use
        // it's ID.
        requestPromise({
            uri: `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/fhir/Patient`,
            json: true,
            qs: {
                _count: 1
            }
        })

        // Use the first patient ID
        .then(res => res.body.entry[0].resource.id)

        // Now do another request with that ID
        .then(id => {
            patientID = id;
            return requestPromise({
                uri: `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/fhir/Patient/${id}`,
                json: true
            });
        }) 

        // Get the second id. This should fail if we had a search set
        .then(res => res.body.resourceType == "Patient" && res.body.id == patientID)

        // log?
        .then(patient => console.log(patient))

        // complete
        .then(() => done(), done);
        // request(app).get(`/v/${PREFERRED_FHIR_VERSION}/fhir/Patient/`).expect(/\n.+/, done);
    });

    it ("Pretty print if called from a browser");

    if (ENABLE_FHIR_VERSION_3) {
        it ("Replies with application/fhir+json for STU3", done => {
            request(app)
            .get(`/v/${PREFERRED_FHIR_VERSION}/fhir/Patient`)
            .expect("content-Type", /^application\/fhir\+json/i)
            .end(done);
        });
    }

    if (ENABLE_FHIR_VERSION_2) {
        it ("Replies with application/json+fhir for DSTU2", done => {
            request(app)
            .get("/v/r2/fhir/Patient")
            .expect("content-Type", /^application\/json\+fhir/i)
            .expect(/\n.+/, done);
        });
    }

    it ("Replies with formatted JSON for bundles", done => {
        request(app).get(`/v/${PREFERRED_FHIR_VERSION}/fhir/Patient`).expect(/\n.+/, done);
    });

    it ("Replies with formatted JSON for single resources", done => {
        request(app).get(`/v/${PREFERRED_FHIR_VERSION}/fhir/Observation/smart-5328-height`).expect(/\n.+/, done);
    });

    it ("Handles pagination", done => {
        request(app)
        .get(`/v/${PREFERRED_FHIR_VERSION}/fhir/Patient`)
        .expect(res => {
            if (!Array.isArray(res.body.link)) {
                throw new Error("No links found");
            }

            let next = res.body.link.find(l => l.relation == "next")
            if (!next) {
                throw new Error("No next link found");
            }
            // console.log(next)
            return request(app).get(next.url).expect(res2 => {
                if (!Array.isArray(res.body.link)) {
                    throw new Error("No links found on second page");
                }

                let self = res.body.link.find(l => l.relation == "self")
                if (!self) {
                    throw new Error("No self link found on second page");
                }
                if (self.url !== next.url) {
                    throw new Error("Links mismatch");
                }

                let next2 = res.body.link.find(l => l.relation == "next")
                if (!next2) {
                    throw new Error("No next link found on second page");
                }

                console.log(next2)
            })
        })
        .end(done);
    });
});

describe('Auth', function() {
    describe('authorize', function() {

        // auth/authorize Checks for required params
        buildRoutePermutations("auth/authorize").forEach(path => {
            let query = [];
            [
                "response_type",
                "client_id",
                "redirect_uri",
                "scope",
                "state",
                "aud"
            ].forEach(name => {
                it(`${path} requires "${name}" param`, done => {
                    request(app)
                    .get(path + "?" + query.join("&"))
                    .expect(400)
                    .expect(`Missing ${name} parameter`)
                    .end(() => {
                        query.push(name + "=" + (name == "redirect_uri" ? "http%3A%2F%2Fx" : "x"));
                        done();
                    });
                });
            });
        });

        // auth/authorize validates the redirect_uri parameter
        buildRoutePermutations("auth/authorize").forEach(path => {
            it(`${path} - validates the redirect_uri parameter`, done => {
                request(app)
                .get(path + "?response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&aud=x")
                .expect(/^Invalid redirect_uri parameter/)
                .expect(400)
                .end(done);
            });
        });

        // can simulate invalid redirect_uri error
        {
            let sim = new Buffer('{"auth_error":"auth_invalid_redirect_uri"}').toString('base64');
            let paths = buildRoutePermutations("auth/authorize?launch=" + sim + "&response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x");
            paths.push(`/v/${PREFERRED_FHIR_VERSION}/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x"`);
            paths.forEach(path => {
                it (path.split("?")[0] + " can simulate invalid redirect_uri error", done => {
                    request(app)
                    .get(path)
                    .expect(302)
                    .expect(function(res) {
                        if (!res.headers.location || res.headers.location.indexOf("error=sim_invalid_redirect_uri") == -1) {
                            throw new Error(`No error passed to the redirect ${res.headers.location}`)
                        }
                    })
                    .end(done);
                });
            });
        }

        // can simulate invalid scope error
        {
            let sim = new Buffer('{"auth_error":"auth_invalid_scope"}').toString('base64');
            let paths = buildRoutePermutations("auth/authorize?launch=" + sim + "&response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x");
            paths.push(`/v/${PREFERRED_FHIR_VERSION}/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x"`);
            paths.forEach(path => {
                it (path.split("?")[0] + " can simulate invalid scope error", done => {
                    request(app)
                    .get(path)
                    .expect(302)
                    .expect(function(res) {
                        if (!res.headers.location) {
                            throw new Error(`No redirect`)
                        }
                        let url = Url.parse(res.headers.location, true);
                        if (url.query.error != "sim_invalid_scope") {
                            throw new Error(`Wrong redirect ${res.headers.location}`)
                        }
                    })
                    .end(done);
                });
            });
        }

        // can simulate invalid client_id error
        {
            let sim = new Buffer('{"auth_error":"auth_invalid_client_id"}').toString('base64');
            let paths = buildRoutePermutations("auth/authorize?launch=" + sim + "&response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x");
            paths.push(`/v/${PREFERRED_FHIR_VERSION}/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x"`);
            paths.forEach(path => {
                it (path.split("?")[0] + " can simulate invalid client_id error", done => {
                    request(app)
                    .get(path)
                    .expect(302)
                    .expect(function(res) {
                        if (!res.headers.location) {
                            throw new Error(`No redirect`)
                        }
                        let url = Url.parse(res.headers.location, true);
                        if (url.query.error != "sim_invalid_client_id") {
                            throw new Error(`Wrong redirect ${res.headers.location}`)
                        }
                    })
                    .end(done);
                });
            });
        }

        // rejects invalid audience value
        buildRoutePermutations(
            "auth/authorize?response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&launch=0&aud=whatever" +
            encodeURIComponent(config.fhirServerR2),
            2
        ).forEach(path => {
            it (path.split("?")[0] + " rejects invalid audience value", done => {
                request(app)
                .get(path)
                .expect(302)
                .expect(function(res) {
                    if (!res.headers.location) {
                        throw new Error(`No redirect`)
                    }
                    let url = Url.parse(res.headers.location, true);
                    if (url.query.error != "bad_audience") {
                        throw new Error(`Wrong redirect ${res.headers.location}`)
                    }
                })
                .end(done);
            });
        });

        // can show encounter picker
        buildRoutePermutations(
            "auth/authorize" +
            "?client_id=x" +
            "&response_type=code" +
            "&scope=patient%2F*.read%20launch" +
            "&redirect_uri=https%3A%2F%2Fsb-apps.smarthealthit.org%2Fapps%2Fgrowth-chart%2F" +
            "&state=x" +
            "&login_success=1" +
            "&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d"
        ).forEach(path => {
            let aud = encodeURIComponent(config.baseUrl + path.split("auth/authorize")[0] + "fhir");
            let launch = new Buffer(JSON.stringify({
                launch_ehr      : 1,
                select_encounter: 1
            })).toString("base64");
            let fullPath = path + "&aud=" + aud + "&launch=" + launch;

            it (path.split("?")[0] + " can show encounter picker", done => {
                request(app)
                .get(fullPath)
                .expect(302)
                .expect(function(res) {
                    if (!res.headers.location || res.headers.location.indexOf(fullPath.replace(/\/auth\/authorize\?.*/, "/encounter?")) !== 0) {
                        throw new Error(`Wrong redirect ${res.headers.location}`)
                    }
                })
                .end(done);
            });
        });
    });

    describe('Confidential Clients', function() {
        buildRoutePermutations("auth/token").forEach(path => {
            let token = jwt.sign("whatever", config.jwtSecret);

            it (`${path} - can simulate auth_invalid_client_secret`, done => {
                request(app)
                .post(path)
                .type('form')
                .set("Authorization", "Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz")
                .send({
                    grant_type: "refresh_token",
                    auth_error: "auth_invalid_client_secret",
                    refresh_token: token
                })
                .expect("Simulated invalid client secret error")
                .expect(401)
                .end(done);
            });

            it (`${path} - rejects empty auth header`, done => {
                request(app)
                .post(path)
                .type('form')
                .set("Authorization", "Basic")
                .send({
                    grant_type: "refresh_token",
                    refresh_token: token
                })
                .expect("The authorization header 'Basic' cannot be empty")
                .expect(401)
                .end(done);
            });

            it (`${path} - rejects invalid auth header`, done => {
                request(app)
                .post(path)
                .type('form')
                .set("Authorization", "Basic bXktYXB")
                .send({
                    grant_type: "refresh_token",
                    refresh_token: token
                })
                .expect(/^Bad authorization header/)
                .expect(401)
                .end(done);
            });

            it (`${path} - can simulate sim_invalid_token`, done => {
                let code = jwt.sign({ auth_error:"token_invalid_token" }, config.jwtSecret);
                request(app)
                .post(path)
                .type('form')
                .set("Authorization", "Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz")
                .send({
                    grant_type: "authorization_code",
                    code
                })
                .expect("Simulated invalid token error")
                .expect(401)
                .end(done);
            });
        });
    });

    describe('OIDC signature algorithm works correctly', function() {
        buildRoutePermutations().forEach(path => {
            let code, idToken, key, keysLocation;
            let aud = config.baseUrl + path + "fhir";
            let launch = encodeSim({
                launch_pt : 1,
                skip_login: 1,
                skip_auth : 1,
                patient   : "abc",
                encounter : "bcd"
            });
            it(`${path}auth/authorize - generates a code`, done => {
                // getAuthCode({
                //     client_id: "x",
                //     patient: "x"
                // });

                request(app)
                .get(`${path}auth/authorize?response_type=code&launch=${launch}` +
                `&patient=abc&client_id=x&redirect_uri=${encodeURIComponent("http://x.y")}` +
                `&scope=profile%20openid%20launch&state=x&aud=${encodeURIComponent(aud)}`)
                .expect(302)
                .expect(function(res) {
                    if (!res.headers.location) {
                        throw new Error(`auth/authorize did not redirect to the redirect_uri`)
                    }
                    let url = Url.parse(res.headers.location, true);
                    code = url.query.code;
                    if (!code) {
                        console.log(res.headers)
                        throw new Error(`auth/authorize did not redirect to the redirect_uri with code parameter`)
                    }
                    // console.info("code: ", JSON.parse(Buffer.from(code.split(".")[1], 'base64').toString()));
                })
                .end(done);
            });

            it(`${path}auth/token - provides id_token`, done => {
                getAuthToken({ code, baseUrl: config.baseUrl + path }).then(body => {
                    if (!body || !body.id_token) {
                        return done(new Error(`auth/token did not return id_token`));
                    }
                    idToken = body.id_token;
                    done();
                }, done);
            });

            it(`the access token can be verified`, done => {
                lookupOidcKeys((error, keys) => {
                    if (error) {
                        return done(error);
                    }
                    key = keys[0]
                    try {
                        jwt.verify(idToken, jwkToPem(key), { algorithms: ["HS256"] })
                        done()
                    } catch (ex) {
                        done(ex)
                    }
                });
            });
        });
    });

    describe('token', function() {
        buildRoutePermutations().forEach(path => {
            it(`${path}auth/token can simulate sim_expired_refresh_token`, done => {
                authorize({
                    scope  : "offline_access",
                    baseUrl: config.baseUrl + path,
                    launch : {
                        launch_pt : 1,
                        skip_login: 1,
                        skip_auth : 1,
                        patient   : "abc",
                        encounter : "bcd",
                        auth_error: "token_expired_refresh_token"
                    }
                })
                .then(tokenResponse => {
                    return refreshSession({
                        baseUrl: config.baseUrl + path,
                        accessToken: tokenResponse.access_token,
                        refreshToken: tokenResponse.refresh_token
                    });
                })
                .then(result => {
                    if (result != config.errors.sim_expired_refresh_token) {
                        return done(new Error("No sim_expired_refresh_token error returned"));
                    }
                    done();
                }, done);
            });
        });
    });
});
