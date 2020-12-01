
const Request   = require('request');
const request   = require('supertest');
const app       = require("../src/index.js");
const config    = require("../src/config");
const jwt       = require("jsonwebtoken");
const Url       = require("url");
const jwkToPem  = require("jwk-to-pem");
const Codec     = require("../static/codec.js");
const base64url = require("base64-url");
const Lib       = require("../src/lib");
const crypto    = require("crypto");
const expect    = require("chai").expect;


const ENABLE_FHIR_VERSION_2  = true;
const ENABLE_FHIR_VERSION_3  = true;
const ENABLE_FHIR_VERSION_4  = true;
const PREFERRED_FHIR_VERSION = ENABLE_FHIR_VERSION_4 ? "r4" : ENABLE_FHIR_VERSION_3 ? "r3" : "r2";
const PUBLIC_KEY  = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFyTmx6RlFwbzRIZWY5dkVPYkdPUQpqc0RtelhyWFY4aDd3bVFxaFdhRkh0cCtLZW14ZmplOU02YkNrdjFsQ2RkajNFU3ZqeTkrd3lHTFlXQXJIdFYrCitGVVA5NjJPTVI5L2lNakpGZ0RDQjM5bnY0MGZLaTJBajRseCt6cE1XUnJZdVN3ZWdiYnNtT0hrL2t5RXUrSlgKTGgzNDlOZlZQSGdaRlhNUno5bUhXNk9hT21PVEVVYlY1RWJ0TnIxUFpCQVNYSGhpZ3VBTXZGcFl5Z2I3blFzQgo4OTBUOXVWcmM4bDB1OWpwc2J2OU10ZXZFeGZCTFlGSDQ4LzFrOUovWk5aalhBY281U2E3QTFlVXZGaSt0b01oCnBPL0lpVCs0L1BQaVRmYU9naXkrd3piNEFhUnF0MVMvWWx5RExIeVJuV3hlNThkMTdWZGY0Y0EzclVpVll0ZEEKWVFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==";
const PRIVATE_KEY = "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBck5sekZRcG80SGVmOXZFT2JHT1Fqc0RtelhyWFY4aDd3bVFxaFdhRkh0cCtLZW14CmZqZTlNNmJDa3YxbENkZGozRVN2ank5K3d5R0xZV0FySHRWKytGVVA5NjJPTVI5L2lNakpGZ0RDQjM5bnY0MGYKS2kyQWo0bHgrenBNV1JyWXVTd2VnYmJzbU9Iay9reUV1K0pYTGgzNDlOZlZQSGdaRlhNUno5bUhXNk9hT21PVApFVWJWNUVidE5yMVBaQkFTWEhoaWd1QU12RnBZeWdiN25Rc0I4OTBUOXVWcmM4bDB1OWpwc2J2OU10ZXZFeGZCCkxZRkg0OC8xazlKL1pOWmpYQWNvNVNhN0ExZVV2RmkrdG9NaHBPL0lpVCs0L1BQaVRmYU9naXkrd3piNEFhUnEKdDFTL1lseURMSHlSbld4ZTU4ZDE3VmRmNGNBM3JVaVZZdGRBWVFJREFRQUJBb0lCQVFDakRTVlFUZGVORjR0ZwpxUmlRQ29RTkJjOHpPcFAxRFB3aDdkZG1xOFVieThTRHlSMVVFVVI3ZXUzRk54K2UzdjRtaE95UFI2QnVkakJECkZUTFlEVkdPOUw3eFIxa0E0ZE91dHFscUJpRUNiWjd5eFM4RzNKR1AxWG9lSVdwd0M3RXhUSHNpcGVvZWRjbE0KVWVaTVRrRXJFYjhOU0tTd1BDSjlaMlVBQ3hWeXpSN3FraE5hVUZYRGNYb2U5Y2FiK3hCRWFJZkFSUUFodllBVwo3ZTlraldjbzRaRTREWm1HL1JnYnRkR1cxZ05xcERiWnE2cDR4VThIUHdoWWVPVko0dmgwUEZHVEp2VWJPTUx5CjU0dEx5a2lFc0lnQzYzRXZ1aTdmQzByWmRiVEt3Z293dnZvWC9uVXhua1VUQ25sREZtUnFReitCVURLZkVlcWIKRyt4V0NWYUJBb0dCQU5mRDBvN0dIRlhKRDBLMlRuSFdHVWhEdjdTMnJBS2lncHZrdVlqNkFSV3NqckJ1VWpGTgpzSGNnRW52cHRFZloyb2lRZjh0eTNCMG9RdnNsYUxwaTBTOG9uZGVISWI2Sms5SU5xRzJzeE5DdjAxdnozam1GCkk4aGFUajRwSzBpQ3lNWnVISUhWSHFQdUZWOStvSHc1QWVkbytSUjlRZ2NHMEdUTEduYWhHOENKQW9HQkFNMFUKN1lBYkJFVm4wY0JoYU9OREFhVmFLMlBZaGdjc3BOOGJNVDh1QlhYU2VzTXkyS3dRS0EwQVNLbm5vcUNoeThyeQpVbUFRN1NNUHM4V25OcEo4Ukh2cXBOazNiSVEyMnpLSHNBQkNmZ29pcWtPc2FqZmYvQWk0Y1E3UGMwYzV0LzA5CmRnOFJNMEw3cmhBdndRUnFraHNST09UemZocTRONVE0Qnd4NGV4c1pBb0dCQU1FU1JaUGt5dTRvb0RNK0Z5dmUKUFhsZ3htYmJIMGlzU3R0YzdIa1ozV2FicG9OUjlOS1JobHJTcERlbGhPRFduS3FmUXZ1MnFDaWZJbkRCcE5sRQpHNU5yY1BLdnhRNU81YXVNOVM1Tzd6OGVWcTl0cFdrckxqM1dNVFdHZVdqRlB3dnc5Q2xwbjZWcElrNzFiSDQ4Ck5PdnlEeEM2bFI3Y2hoWHJlSjYydzdLaEFvR0FTUHI3a2EwTGxnOWVDMUllMjFFTEV1YkZyaUJ0Z2J3WFovWHIKVG9wNEV2ZTJEQ1RhQ2xFdGo0TGNXT28vYTE1b2dXNCtka1ZQdmp4bVF4NUFRMXpKbWpka05wQ01vM2hLQk85WQphSjlBN3lacTVPNUVWbUgwOUwxK0xrRVF5dlgxVGI5RGRoVXU0dFZobWcwRWFTZnJtb3BFYnVWZnFPNkppTXR2ClpyYXhTSEVDZ1lBcW5EZ0Q3bW53bnFGdmJ0R2JTUjRUdVJzYi9TQi9HejArSzNtdDhRME5NbWNIVDFsM0c1REEKWDEvU3hZdUxLZ1F5UWNPQUh2b3RxcUp0R3I2d0ZaOHJVdnIwTnEwQUtFa2JyODF2V2NpbkhySWFySkZUaVE5Vgp2SGNxYktoRlJ5dEtndjdZcEt1STJSUWM5dG9FNS9BbDZBejJOdlJZOGJ2MzN3QUFxTTl1OXc9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=";



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
 * @returns {Object} Returns the response object to simplify promise chains
 * @throws {Error}
 */
function expectStatusCode(res, code) {
    if (res.statusCode !== code) {
        throw new Error(`Expecting status code of ${code} but received ${res.statusCode}`);
    }
    return res;
}

/**
 * Throws an error if the response does not have the specified header.
 * The header name is required and the value is optional.
 * @param {Object} res The response
 * @param {String} name The name of the header
 * @param {String|RegExp} [value] The header value (checks for presence only if
 * this is missing)
 * @returns {Object} Returns the response object to simplify promise chains
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
                throw new Error(`The ${name} response header "${header}" did not match the specified RegExp`);
            }
        }
        else if (header !== value) {
            throw new Error(`Expecting ${name} response header to equal ${value} but found ${header}`);
        }
    }
    return res;
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
 * @param {String} options.baseUrl
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
                let code = url.query.code + "";
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

function decodeJwtToken(token) {
    return JSON.parse(
        new Buffer(token.split(".")[1], "base64").toString("utf8")
    );
}
////////////////////////////////////////////////////////////////////////////////
let server;
before(() => {
    return new Promise((resolve, reject) => {
        server = app.listen(config.port, error => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
});

after(() => {
    if (server && server.listening) {
        return new Promise(resolve => {
            server.close(error => {
                if (error) {
                    console.log("Error shutting down the : ", error);
                }
                server = null;
                resolve();
            });
        });
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

    it ("Can simulate custom token errors", null);
    it ("Keeps protected data-sets read-only", null);
    it ("Inject sandbox tag into POST and PUT requests", null);
    it ("Make urls conditional and if exists, change /id to ?_id=", null);
    it ("Apply patient scope to GET requests", null);

    it ("Adjust urls in the fhir response", done => {
        request(app)
        .get("/v/" + PREFERRED_FHIR_VERSION + "/fhir/Patient")
        .expect(res => {
            // FIXME: version mismatch...
            if (res.text.indexOf(config.fhirServerR3) > -1) {
                throw new Error("Not all URLs replaced");
            }
        })
        .end(done);
    });

    buildRoutePermutations("fhir/metadata").forEach(path => {
        it(path + ' inject the SMART information in metadata responses', done => {
            request(app)
            .get(path)
            .expect('Content-Type', /\bjson\b/i)
            .expect(200)
            .expect(res => {
                let uris = Lib.getPath(res.body, "rest.0.security.extension.0.extension");
                
                // authorize ---------------------------------------------------
                let authorizeCfg = uris.find(o => o.url == "authorize");
                if (!authorizeCfg) {
                    throw new Error("No 'authorize' endpoint found in the conformance statement");
                }
                if (authorizeCfg.valueUri != config.baseUrl + path.replace("fhir/metadata", "auth/authorize")) {
                    throw new Error("Wrong 'authorize' endpoint found in the conformance statement");
                }

                // token -------------------------------------------------------
                let tokenCfg = uris.find(o => o.url == "token");
                if (!tokenCfg) {
                    throw new Error("No 'token' endpoint found in the conformance statement");
                }
                if (tokenCfg.valueUri != config.baseUrl + path.replace("fhir/metadata", "auth/token")) {
                    throw new Error("Wrong 'token' endpoint found in the conformance statement");
                }

                // register ----------------------------------------------------
                // TODO: Un-comment when we support DCR
                // let registerCfg  = uris.find(o => o.url == "register");
                // if (!registerCfg) {
                //     throw new Error("No 'register' endpoint found in the conformance statement");
                // }
                // if (registerCfg.valueUri != config.baseUrl + path.replace("fhir/metadata", "auth/register")) {
                //     throw new Error("Wrong 'register' endpoint found in the conformance statement");
                // }
            })
            .end(done);
        });
    });

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

        // Did we get a patient with the requested id?
        .then(res => {
            return res.body.resourceType == "Patient" && res.body.id == patientID ?
                Promise.resolve() :
                Promise.reject("No patient returned by id")
        })

        // complete
        .then(() => done(), done);
    });

    // it ("Pretty print if called from a browser", () => {
    //     expect(1).to.equal(2);
    // });

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

            // it(`${path} with missing "client_id" param`, done => {
            //     request(app)
            //     .get(path + "?response_type=code&client_id=&redirect_uri=http%3A%2F%2Fx&aud=x&state=abc")
            //     .end(function(error, res) {
            //         console.log(res.body, res.headers)
            //         done();
            //     });
            // });
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
                        const loc = res.get("location");
                        if (!loc || loc.indexOf("error=sim_invalid_redirect_uri") == -1) {
                            throw new Error(`No error passed to the redirect ${loc}`)
                        }
                    })
                    .expect(function(res) {
                        const loc = res.get("location");
                        if (!loc || loc.indexOf("state=x") == -1) {
                            throw new Error(`No state passed to the redirect ${loc}`)
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
                        const loc = res.get("location");
                        if (!loc) {
                            throw new Error(`No redirect`)
                        }
                        let url = Url.parse(loc, true);
                        if (url.query.error != "sim_invalid_scope") {
                            throw new Error(`Wrong redirect ${loc}`)
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
                        const loc = res.get("location");
                        if (!loc) {
                            throw new Error(`No redirect`)
                        }
                        let url = Url.parse(loc, true);
                        if (url.query.error != "sim_invalid_client_id") {
                            throw new Error(`Wrong redirect ${loc}`)
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
                    const loc = res.get("location");
                    if (!loc) {
                        throw new Error(`No redirect`)
                    }
                    let url = Url.parse(loc, true);
                    if (url.query.error != "bad_audience") {
                        throw new Error(`Wrong redirect ${loc}`)
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
            "&redirect_uri=" + encodeURIComponent("https://sb-apps.smarthealthit.org/apps/growth-chart/") +
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
                    const loc = res.get("location");
                    if (!loc || loc.indexOf(fullPath.replace(/\/auth\/authorize\?.*/, "/encounter?")) !== 0) {
                        throw new Error(`Wrong redirect ${loc}`)
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
            it(`${path}auth/authorize - generates a code from profile`, done => {
                request(app)
                .get(`${path}auth/authorize?response_type=code&launch=${launch}` +
                `&patient=abc&client_id=x&redirect_uri=${encodeURIComponent("http://x.y")}` +
                `&scope=profile%20openid%20launch&state=x&aud=${encodeURIComponent(aud)}`)
                .expect(302)
                .expect(function(res) {
                    if (!res.get("location")) {
                        throw new Error(`auth/authorize did not redirect to the redirect_uri`)
                    }
                    let url = Url.parse(res.get("location"), true);
                    code = url.query.code;
                    if (!code) {
                        // console.log(res.headers)
                        throw new Error(`auth/authorize did not redirect to the redirect_uri with code parameter`)
                    }
                    // console.info("code: ", JSON.parse(Buffer.from(code.split(".")[1], 'base64').toString()));
                })
                .end(done);
            });

            it(`${path}auth/authorize - generates a code from fhirUser`, done => {
                request(app)
                .get(`${path}auth/authorize?response_type=code&launch=${launch}` +
                `&patient=abc&client_id=x&redirect_uri=${encodeURIComponent("http://x.y")}` +
                `&scope=fhirUser%20openid%20launch&state=x&aud=${encodeURIComponent(aud)}`)
                .expect(302)
                .expect(function(res) {
                    if (!res.get("location")) {
                        throw new Error(`auth/authorize did not redirect to the redirect_uri`)
                    }
                    let url = Url.parse(res.get("location"), true);
                    code = url.query.code;
                    if (!code) {
                        // console.log(res.headers)
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
                        jwt.verify(idToken, jwkToPem(key), { algorithms: ["RS256"] })
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

    describe('Introspection', () => {

        buildRoutePermutations().forEach(path => {
            it(`can introspect ${path}`, (done) => {
                authorize({
                    scope  : "offline_access",
                    baseUrl: config.baseUrl + path,
                    launch : {
                        launch_pt : 1,
                        skip_login: 1,
                        skip_auth : 1,
                        patient   : "abc",
                        encounter : "bcd",
                    }
                }).then(token => {
                    request(app)
                        .post(`${path}auth/introspect`)
                        .set('Authorization', `Bearer ${token.access_token}`)
                        .set('Accept', 'application/json')
                        .set('Content-Type', 'application/x-www-form-urlencoded')
                        .send({ token: token.access_token })
                        .expect(200)
                        .expect(res => {
                            if(res.body?.active !== true) throw new Error("Token is not active." + JSON.stringify(res.body))
                        })
                        .end(done)

                }).catch(done)
            })
        })
    })
});

describe('Generator', () => {
    describe('RSA Generator', function() {
        this.timeout(20000);
        it ("can generate random strings", async () => {
            let res = await requestPromise({
                uri: `${config.baseUrl}/generator/random`,
                json: true,
                qs: {
                    enc: "hex"
                }
            });
            expect(res.body).to.match(/^[0-9a-fA-F]*$/);
            
            // res = await requestPromise({
            //     uri: `${config.baseUrl}/generator/random`,
            //     // json: true,
            //     // qs: {
            //     //     enc: "base64",
            //     //     len: 10
            //     // }
            // });
            // console.log(decodeURI(res.body))
            // expect(res.body.length).to.equal(10);
        });

        it ("can generate random RSA-256 key pairs", done => {
            let privateKey, publicKey;

            function ketKeyPair() {
                return requestPromise({
                    uri: `${config.baseUrl}/generator/rsa`,
                    json: true,
                    qs: {
                        enc: "base64"
                    }
                })
                .then(res => expectStatusCode(res, 200))
                .then(res => expectResponseHeader(res, 'Content-Type', /\bjson\b/i))
                .then(res => {
                    let { privateKey, publicKey } = res.body;
                    if (!privateKey) {
                        return Promise.reject(
                            new Error("The generator did not create a private key")
                        );
                    }
                    if (!publicKey) {
                        return Promise.reject(
                            Error("The generator did not create a public key")
                        );
                    }
                    return { privateKey, publicKey };
                });
            }

            ketKeyPair()
            .then(keys => {
                privateKey = keys.privateKey;
                publicKey  = keys.publicKey;
                return ketKeyPair();
            })
            .then(keys => {
                if (keys.privateKey == privateKey) {
                    throw new Error("privateKey does not change between requests");
                }
                if (keys.publicKey == publicKey) {
                    throw new Error("publicKey does not change between requests");
                }
                done();
            })
            .catch(done);
        });
    });
});

describe('Backend Services', () => {


    describe('Client Registration', () => {

        it ("requires form-urlencoded POST", done => {
            requestPromise({
                method: "POST",
                uri: `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/register`
            })
            .then(res => expectStatusCode(res, 401))
            .then(res => {
                if (res.body != "Invalid request content-type header (must be 'application/x-www-form-urlencoded')") {
                    throw new Error("Did not return the proper error message");
                }
                return res;
            })
            .then(res => done(), done)
        });

        it ("requires 'iss' parameter", done => {
            requestPromise({
                method: "POST",
                uri   : `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/register`,
                form  : {}
            })
            .then(res => expectStatusCode(res, 400))
            .then(res => {
                if (res.body != "Missing iss parameter") {
                    throw new Error("Did not return the proper error message");
                }
                return res;
            })
            .then(res => done(), done)
        });

        it ("requires 'pub_key' parameter", done => {
            requestPromise({
                method: "POST",
                uri   : `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/register`,
                form  : {
                    iss: "whatever"
                }
            })
            .then(res => expectStatusCode(res, 400))
            .then(res => {
                if (res.body != "Missing pub_key parameter") {
                    throw new Error("Did not return the proper error message");
                }
                return res;
            })
            .then(res => done(), done)
        });

        it ("validates the 'dur' parameter", done => {
            Promise.all(
                [
                    "x",
                    Infinity,
                    -Infinity,
                    -2
                ].map(dur => {
                    return requestPromise({
                        method: "POST",
                        uri   : `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/register`,
                        form  : {
                            iss: "whatever",
                            pub_key: "abc",
                            dur
                        }
                    })
                    .then(res => expectStatusCode(res, 400))
                    .then(res => {
                        if (res.body != "Invalid dur parameter") {
                            throw new Error("Did not return the proper error message");
                        }
                        return res;
                    });
                })
            )
            .then(res => done(), done)
        });

        it ("basic usage", done => {
            requestPromise({
                method: "POST",
                uri   : `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/register`,
                form  : {
                    iss    : "whatever",
                    pub_key: "something"
                }
            })
            .then(res => expectStatusCode(res, 200))
            .then(res => expectResponseHeader(res, "content-type", /\btext\/plain\b/i))
            .then(res => {
                if (res.body.split(".").length != 3) {
                    throw new Error("Did not return proper client id");
                }
                return res;
            })
            .then(res => done(), done)
        });

        it ("accepts custom duration", done => {
            requestPromise({
                method: "POST",
                uri   : `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/register`,
                form  : {
                    iss    : "whatever",
                    pub_key: "something",
                    dur    : 23
                }
            })
            .then(res => expectStatusCode(res, 200))
            .then(res => expectResponseHeader(res, "content-type", /\btext\/plain\b/i))
            .then(res => {
                if (res.body.split(".").length != 3) {
                    throw new Error("Did not return proper client id");
                }
                let token = decodeJwtToken(res.body);
                let exp = token.accessTokensExpireIn;
                if (exp != 23) {
                    throw new Error(
                        `Expected "accessTokensExpireIn" property to equal 23 but found ${exp}`
                    )
                }
            })
            .then(res => done(), done)
        });

        it ("accepts custom simulated errors", done => {
            const err = "test error"
            requestPromise({
                method: "POST",
                uri   : `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/register`,
                form  : {
                    iss    : "whatever",
                    pub_key: "something",
                    auth_error: err
                }
            })
            .then(res => expectStatusCode(res, 200))
            .then(res => expectResponseHeader(res, "content-type", /\btext\/plain\b/i))
            .then(res => {
                if (res.body.split(".").length != 3) {
                    throw new Error("Did not return proper client id");
                }
                let token = decodeJwtToken(res.body);
                let x = token.auth_error;
                if (x !== err) {
                    throw new Error(
                    `Expected "auth_error" property to equal "${err}" but found "${x}"`
                    )
                }
            })
            .then(res => done(), done)
        });
    });

    describe('Authorization Claim', () => {
        it ("Works as expected", done => {
            const iss = "whatever";
            const tokenUrl = `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/token`;

            requestPromise({
                method: "POST",
                uri   : `${config.baseUrl}/v/${PREFERRED_FHIR_VERSION}/auth/register`,
                form  : {
                    iss,
                    pub_key: PUBLIC_KEY
                }
            })
            .then(res => {
                let jwtToken = {
                    iss,
                    sub: res.body,
                    aud: tokenUrl,
                    exp: Date.now()/1000 + 300, // 5 min
                    jti: crypto.randomBytes(32).toString("hex")
                };
        
                return requestPromise({
                    method: "POST",
                    url   : tokenUrl,
                    json  : true,
                    form  : {
                        scope     : "system/*.*",
                        grant_type: "client_credentials",
                        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                        client_assertion: jwt.sign(
                            jwtToken,
                            base64url.decode(PRIVATE_KEY),
                            { algorithm: 'RS256'}
                        )
                    }
                });
            })
            .then(res => {
                // console.log(res.body);
                if (res.body.token_type !== "bearer") {
                    throw new Error(`Authorization failed! Expecting token_type: bearer but found ${res.body.token_type}`);
                }
                if (res.body.expires_in !== 900) {
                    throw new Error(`Authorization failed! Expecting expires_in: 900 but found ${res.body.expires_in}`);
                }
                if (!res.body.access_token) {
                    throw new Error(`Authorization failed! No access_token returned`);
                }
                if (res.body.access_token.split(".").length != 3) {
                    throw new Error("Did not return proper access_token");
                }
                return res;
            })
            .then(res => done(), done);
        });
    });

    describe('Fhir Requests', () => {
        it ("TODO...");
    });
});
