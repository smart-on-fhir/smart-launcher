const request    = require('supertest')
const jwt        = require("jsonwebtoken")
const crypto     = require("crypto")
const { expect } = require("chai")
const jose       = require("node-jose")
const { Server } = require('http')
const app        = require("../src/index.js")
const config     = require("../src/config")
const Codec      = require("../static/codec.js")
const Lib        = require("../src/lib")

const TESTED_FHIR_SERVERS = {
    "r4": config.fhirServerR4,
    "r3": config.fhirServerR3,
    "r2": config.fhirServerR2
}

/**
 * @param {object} options 
 * @param {string} options.path
 * @param {object} [options.query]
 * @param {string|object} [options.sim]
 * @param {string} [options.fhir]
 */
function buildUrl({ path, query = {}, sim = "", fhir = "r4" }) {

    let _path = "";
    
    if (fhir) {
        _path += "/v/" + fhir;
    }

    if (sim) {
        if (typeof sim == "string") {
            _path += "/sim/" + sim
        } else {
            _path += "/sim/" + jose.util.base64url.encode(JSON.stringify(sim))
        }
    }

    path = (_path + "/" + path).replace(/\/+/g, "/")

    const url = new URL(path, config.baseUrl)

    for (const key in query) {
        if (key == "launch" && query[key] && typeof query[key] != "string") {
            url.searchParams.set(
                key,
                Buffer.from(JSON.stringify(query[key])).toString("base64")
            )
        } else {
            url.searchParams.set(key, query[key])
        }
    }

    return url
}

/**
 * Encodes the object with our proprietary codec to make it smaller. The
 * serializes as JSON and returns a base64 version of it.
 * @param {Object} object The object to encode
 * @returns {String}
 */
 function encodeSim(object = {}) {
    return Buffer.from(JSON.stringify(Codec.encode(object)), "utf8").toString("base64");
}

////////////////////////////////////////////////////////////////////////////////
// app.use((error, req, res, next) => {
//     console.error(error)
//     res.status(500).end()
// })

// -----------------------------------------------------------------------------
/**
 * @type {Server|null}
 */
let server;

async function closeServer() {
    return new Promise((resolve, reject) => {
        if (server && server.listening) {
            server.close(error => {
                if (error) {
                    reject(error);
                } else {
                    // server.unref()
                    // server = null;
                    resolve();
                }
            });
        } else {
            if (server) server.unref()
            resolve();
        }
    });
}

before(async () => {
    await closeServer()
    return new Promise((resolve, reject) => {
        const _server = app.listen(config.port, error => {
            if (error) {
                return reject(error);
            }
            server = _server
            resolve()
        });
    });
});

after(closeServer);

describe("Global stuff", () => {

    it('index responds with html', () => {
        return request(app)
        .get('/')
        .expect('Content-Type', /html/)
        .expect(200);
    });

    it('/keys hosts the public keys', () => {
        return request(app)
        .get('/keys')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
            expect(res.body).to.have.property("keys")
            expect(Array.isArray(res.body.keys)).to.be.true
            expect(res.body.keys.length).to.be.greaterThan(0)
        });
    });
    
    it('/public_key hosts the public key as pem', () => {
        return request(app)
        .get('/public_key')
        .expect('Content-Type', /text/)
        .expect(200)
        .expect(/-----BEGIN PUBLIC KEY-----/)
    });

    it ("/env.js", () => {
        return request(app)
        .get('/env.js')
        .expect('Content-Type', /javascript/)
        .expect(200)
        .expect(/var ENV = \{/)
    })

    it("rejects xml", async () => {
        await request(app)
        .get("/")
        .set("content-type", "application/xml")
        .expect(400, /XML format is not supported/)
    })

    describe("/launcher", () => {
        it("requires launch_uri", async () => {
            await request(app)
            .get('/launcher')
            .expect('Content-Type', /text/)
            .expect(400, "launch_uri is required")
        })

        it("requires absolute launch_uri", async () => {
            await request(app)
            .get('/launcher')
            .query({ launch_uri: "./test" })
            .expect('Content-Type', /text/)
            .expect(400, "Invalid launch_uri parameter")
        })

        // xit ("Can simulate custom token errors", null);
        // xit ("Keeps protected data-sets read-only", null);
        // xit ("Inject sandbox tag into POST and PUT requests", null);
        // xit ("Make urls conditional and if exists, change /id to ?_id=", null);
        // xit ("Apply patient scope to GET requests", null);

        it("validates the fhir_ver param", async () => {
            await request(app)
            .get('/launcher')
            .query({ launch_uri: "http://test.dev", fhir_ver: 33 })
            .expect('Content-Type', /text/)
            .expect(400, "Invalid or missing fhir_ver parameter. It can only be '2', '3' or '4'.")
        })

        it("works", async () => {
            await request(app)
            .get('/launcher')
            .query({ launch_uri: "http://test.dev", fhir_ver: 3 })
            .expect("location", /^http\:\/\/test\.dev\?iss=.+/)
            .expect(302)
        })
    })

    describe('RSA Generator', () => {
        
        it ("can generate random strings", async () => {
            await request(app)
            .get('/generator/random')
            .expect('Content-Type', /text\/plain/)
            .expect(200)
            .expect(/^[0-9a-fA-F]{64}$/);

            await request(app)
            .get('/generator/random')
            .query({ enc: "hex" })
            .expect('Content-Type', /text\/plain/)
            .expect(200)
            .expect(/^[0-9a-fA-F]{64}$/);
        });

        it ("random strings length defaults to 32", async () => {
            await request(app)
            .get('/generator/random')
            .query({ len: -5 })
            .expect('Content-Type', /text\/plain/)
            .expect(200)
            .expect(/^[0-9a-fA-F]{64}$/);
        });

        it ("can generate random RSA-256 key pairs", async () => {

            let { privateKey, publicKey } = await request(app)
            .get("/generator/rsa")
            .expect('content-type', /json/)
            .expect(200)
            .then(res => res.body)

            expect(privateKey, "The generator did not create a private key")
            expect(publicKey, "The generator did not create a public key")

            await request(app)
            .get("/generator/rsa")
            .expect('content-type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.privateKey, "The generator did not create a private key")
                expect(res.body.publicKey, "The generator did not create a public key")
                expect(res.body.privateKey).to.not.equal(privateKey, "privateKey does not change between requests")
                expect(res.body.publicKey).to.not.equal(publicKey, "publicKey does not change between requests")
            })
        });
    });

});

for(const FHIR_VERSION in TESTED_FHIR_SERVERS) {

    /**
     * @param {string} code 
     * @param {string} redirect_uri
     * @param {string} [code_verifier]
     * @returns {import('supertest').Test}
     */
    function getAccessToken(code, redirect_uri, code_verifier) {
        return request(app)
        .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/token" }).pathname)
        .redirects(0)
        .type("form")
        .send({ grant_type: "authorization_code", code, redirect_uri, code_verifier });
    }

    /**
     * @param {object} options 
     * @param {"GET"|"POST"} [options.method]
     * 
     * SMART parameters
     * @param {string}        [options.client_id]
     * @param {string}        [options.scope]
     * @param {string}        [options.state]
     * @param {string}        [options.redirect_uri]
     * @param {object|string} [options.launch] If object, will be converted to base64 json string
     * @param {string}        [options.code_challenge_method] PKCE option; no PKCE request if omitted
     * @param {string}        [options.code_challenge] PKCE option; no PKCE request if omitted
     * 
     * Custom parameters
     * @param {string}         [options.patient]       Pre-selected patient id(s)
     * @param {string}         [options.provider]      Pre-selected provider id(s)
     * @param {string}         [options.encounter]     Pre-selected encounter id(s)
     * @param {number|boolean} [options.auth_success]  Flag to skip the launch confirmation dialog
     * @param {number|boolean} [options.login_success] Flag to skip the launch login dialog
     * @param {number|boolean} [options.aud_validated] Flag to skip the aud validation
     * 
     * @returns { import('supertest').Test }
     */
    function getAuthCodeRaw(options)
    {
        const query = {
            ...options,
            client_id    : options.client_id    || "test_client_id",
            scope        : options.scope        || "test_scope",
            state        : options.state        || "test_state",
            redirect_uri : options.redirect_uri || "http://test_redirect_uri",
            aud          : buildUrl({ fhir: FHIR_VERSION, path: "fhir" }).href,
            response_type: "code"
        }

        if (options.code_challenge_method) {
            query.code_challenge_method = options.code_challenge_method
        }

        if (options.code_challenge) {
            query.code_challenge = options.code_challenge
        }

        const url = buildUrl({ fhir: FHIR_VERSION, path: "/auth/authorize", query });

        if (options.method === "POST") {
            return request(app).post(url.pathname).type("form").send(query).redirects(0);
        }

        return request(app).get(url.pathname).query(url.searchParams.toString()).redirects(0)
    }

    /**
     * @param {object} options 
     * @param {"GET"|"POST"} [options.method]
     * 
     * SMART parameters
     * @param {string}        [options.client_id]
     * @param {string}        [options.scope]
     * @param {string}        [options.state]
     * @param {string}        [options.redirect_uri]
     * @param {object|string} [options.launch] If object, will be converted to base64 json string
     * @param {string}        [options.code_challenge_method] PKCE option; no PKCE request if omitted
     * @param {string}        [options.code_challenge] PKCE option; no PKCE request if omitted
     * 
     * Custom parameters
     * @param {string}         [options.patient]       Pre-selected patient id(s)
     * @param {string}         [options.provider]      Pre-selected provider id(s)
     * @param {string}         [options.encounter]     Pre-selected encounter id(s)
     * @param {number|boolean} [options.auth_success]  Flag to skip the launch confirmation dialog
     * @param {number|boolean} [options.login_success] Flag to skip the launch login dialog
     * @param {number|boolean} [options.aud_validated] Flag to skip the aud validation
     */
    function getAuthCode(options)
    {
        return getAuthCodeRaw(options)
        .expect(302)
        .expect("location", /^https?\:\/\/.+/)
        .then(res => {
            const loc = new URL(res.get("location"));
            const code = loc.searchParams.get("code");
            if (!code) {
                throw new Error(`authorize did not redirect to the redirect_uri with code parameter. ${res.text}`)
            }
            return {
                code,
                state: loc.searchParams.get("state"),
                redirect_uri: options.redirect_uri || "http://test_redirect_uri",
                location: loc
            }
        });
    }

    // function refresh(refreshToken) {
    //     return request(app)
    //     .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/token" }).pathname)
    //     .redirects(0)
    //     .type("form")
    //     .send({ grant_type: "refresh_token", refresh_token: refreshToken })
    //     .expect(200)
    //     .then(res => res.body);
    // }

    describe(`FHIR server ${FHIR_VERSION}`, () => {

        it("Catches body parse errors", async () => {
            await request(app)
            .post(buildUrl({ fhir: FHIR_VERSION, path: "fhir" }).pathname)
            .type("json")
            .send('{"a":1,"b":}')
            .expect(400)
            .expect(/OperationOutcome/)
        })
        
        it('can render the patient picker', () => {
            return request(app)
            .get(buildUrl({ fhir: FHIR_VERSION, path: "picker" }).pathname)
            .expect('Content-Type', /html/)
            .expect(200)
        });

        it('can render the user picker', () => {
            return request(app)
            .get(buildUrl({ fhir: FHIR_VERSION, path: "login" }).pathname)
            .expect('Content-Type', /html/)
            .expect(200)
        });

        it('can render the launch approval dialog', () => {
            return request(app)
            .get(buildUrl({ fhir: FHIR_VERSION, path: "authorize" }).pathname)
            .expect('Content-Type', /html/)
            .expect(200)
        });

        it ("renders .well-known/smart-configuration", async () => {
            return request(app)
            .get(buildUrl({ fhir: FHIR_VERSION, path: ".well-known/smart-configuration" }).pathname)
            .expect('Content-Type', /json/)
            .expect(200)
        })

        describe('Proxy', function() {
            this.timeout(10000);

            it("rejects unknown fhir versions", async () => {
                await request(app)
                .get(buildUrl({ fhir: FHIR_VERSION + 2, path: "/fhir/Patient"}).pathname)
                .expect(400, /FHIR server r\d2 not found/)
            })
            
            it('fhir/metadata responds with html in browsers', () => {
                return request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "fhir/metadata" }).pathname)
                .set('Accept', 'text/html')
                .expect('content-type', /application\/(fhir\+json|json\+fhir|json)/)
                .expect(200)
            });

            it('removes custom headers', () => {
                return request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "fhir/Patient" }).pathname)
                .set('x-custom', 'whatever')
                .expect(res => expect(res.header['x-custom']).to.equal(undefined))
            });

            it ("Validates the FHIR version", () => {
                return request(app)
                .get(buildUrl({ fhir: "r300", path: "fhir/metadata" }).pathname)
                .expect('Content-Type', /json/)
                .expect('{"error":"FHIR server r300 not found"}')
                .expect(400)
            });

            it ("If auth token is sent - validates it", () => {
                return request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "fhir/Patient" }).pathname)
                .set("authorization", "Bearer whatever")
                .expect('Content-Type', /text/)
                .expect(/Invalid token\: /)
                .expect(401)
            });
            
            it ("Adjust urls in the fhir response", () => {
                return request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/Patient" }).pathname)
                .expect(res => {
                    if (res.text.indexOf(TESTED_FHIR_SERVERS[FHIR_VERSION]) > -1) {
                        throw new Error("Not all URLs replaced");
                    }
                })
            });
            
            it ("pull the resource out of the bundle if we converted a /id url into a ?_id= query", async () => {
                
                // We cannot know any IDs but we need to use one for this test, thus
                // query all the patients with _count=1 to find the first one and use
                // it's ID.
                const patientID = await request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/Patient"}).pathname)
                .query({ _count: 1 })
                .expect(200)
                .expect("content-type", /json/)
                .then(res => res.body.entry[0].resource.id);
        
                // Now do another request with that ID
                const resource = await request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/Patient/" + patientID }).pathname)
                .expect(200)
                .expect("content-type", /json/)
                .then(res => res.body);
        
                // Did we get a patient with the requested id?
                expect(resource.resourceType).to.equal("Patient")
                expect(resource.id).to.equal(patientID)
            });

            it ("Handles pagination", () => {
                return request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/Patient" }).pathname)
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
                        // console.log(next2)
                    })
                })
            });

            it ("Replies with formatted JSON for bundles", () => {
                return request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/Patient" }).pathname)
                .expect(/\n.+/);
            });

            it ("Replies with formatted JSON for single resources", () => {
                return request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/X" }).pathname) // Should return OperationOutcome
                .expect(/\n.+/);
            });

            if (FHIR_VERSION === "r2") {
                it (`Replies with application/json+fhir for ${FHIR_VERSION}`, () => {
                    return request(app)
                    .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/Patient" }).pathname)
                    .expect("content-Type", /^application\/json\+fhir/i)
                    .expect(/\n.+/);
                });
            } else {
                it (`Replies with application/fhir+json for ${FHIR_VERSION}`, () => {
                    return request(app)
                    .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/Patient" }).pathname)
                    .expect("content-Type", /^application\/fhir\+json/i)
                    .expect(/\n.+/);
                });
            }

            it('Injects the SMART information in metadata responses', () => {
                return request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "fhir/metadata" }).pathname)
                .expect('content-type', /\bjson\b/i)
                .expect(200)
                .expect(res => {
                    let uris = Lib.getPath(res.body, "rest.0.security.extension.0.extension");
                    
                    // authorize ---------------------------------------------------
                    let authorizeCfg = uris.find(o => o.url == "authorize");
                    if (!authorizeCfg) {
                        throw new Error("No 'authorize' endpoint found in the conformance statement");
                    }
                    if (authorizeCfg.valueUri != buildUrl({ fhir: FHIR_VERSION, path: "auth/authorize" }).href) {
                        throw new Error("Wrong 'authorize' endpoint found in the conformance statement");
                    }
    
                    // token -------------------------------------------------------
                    let tokenCfg = uris.find(o => o.url == "token");
                    if (!tokenCfg) {
                        throw new Error("No 'token' endpoint found in the conformance statement");
                    }
                    if (tokenCfg.valueUri != buildUrl({ fhir: FHIR_VERSION, path: "auth/token" }).href) {
                        throw new Error("Wrong 'token' endpoint found in the conformance statement");
                    }
    
                    // register ----------------------------------------------------
                    // TODO: Un-comment when we support DCR
                    // let registerCfg  = uris.find(o => o.url == "register");
                    // if (!registerCfg) {
                    //     throw new Error("No 'register' endpoint found in the conformance statement");
                    // }
                    // if (registerCfg.valueUri != buildUrl({ fhir: FHIR_VERSION, path: "auth/register" }).href) {
                    //     throw new Error("Wrong 'register' endpoint found in the conformance statement");
                    // }
                });
            });

            it ("Can simulate custom token errors", async () => {
                const token = jwt.sign({ sim_error: "test error" }, config.jwtSecret)
                await request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/Patient" }).pathname)
                .set("authorization", "bearer " + token)
                .expect(401, "test error");
            });

            it ("Keeps protected data-sets read-only");
            it ("Make urls conditional and if exists, change /id to ?_id=");
            it ("Apply patient scope to GET requests");

            describe('Fhir Requests', () => {
                it ("TODO...");
            });
        });

        describe('Auth', () => {
            describe('authorize', () => {
                
                const url = buildUrl({ fhir: FHIR_VERSION, path: "/auth/authorize" });

                const fullQuery = {
                    response_type: "code",
                    client_id: "x",
                    redirect_uri: "http://x",
                    scope: "x",
                    state: "x",
                    aud: "x"
                };

                const authErrors = {
                    "auth_invalid_client_id"   : /error_description=Simulated\+invalid\+client_id\+parameter\+error/,
                    "auth_invalid_scope"       : /error_description=Simulated\+invalid\+scope\+error/
                }

                it(`requires "response_type" param`, () => {
                    const query = { ...fullQuery };
                    delete query.response_type
                    return request(app)
                    .get(url.pathname)
                    .query(query)
                    .expect(302)
                    .expect("location", /error_description=Missing\+response_type\+parameter/)
                    .expect("location", /state=x/)
                });

                it(`requires "redirect_uri" param`, () => {
                    const query = { ...fullQuery };
                    delete query.redirect_uri
                    return request(app)
                    .get(url.pathname)
                    .query(query)
                    .expect(400)
                    .expect({ error: "invalid_request", error_description: "Missing redirect_uri parameter" })
                });

                // validates the redirect_uri parameter
                // -------------------------------------------------------------
                it("validates the redirect_uri parameter", () => {
                    return request(app)
                    .get(url.pathname)
                    .query({ ...fullQuery, redirect_uri: "x" })
                    .expect({ error: "invalid_request", error_description: "Invalid redirect_uri parameter 'x' (must be full URL)" })
                    .expect(400);
                });

                it (`can simulate invalid_redirect_uri error`, () => {

                    const url = buildUrl({
                        fhir: FHIR_VERSION,
                        path: "/auth/authorize",
                        sim: {
                            auth_error: "auth_invalid_redirect_uri"
                        }
                    });
    
                    return request(app)
                    .get(url.pathname)
                    .query(fullQuery)
                    .expect(400)
                    .expect({error:"invalid_request",error_description:"Simulated invalid redirect_uri parameter error"})
                });

                // other simulated errors
                // -------------------------------------------------------------
                Object.keys(authErrors).forEach(errorName => {
                    it (`can simulate "${errorName}" error via sim`, () => {

                        const url = buildUrl({
                            fhir: FHIR_VERSION,
                            path: "/auth/authorize",
                            sim: {
                                auth_error: errorName
                            }
                        });
        
                        return request(app)
                        .get(url.pathname)
                        .query(fullQuery)
                        .expect(302)
                        .expect("location", authErrors[errorName])
                    });

                    it (`can simulate "${errorName}" error via launch param`, () => {

                        const url = buildUrl({
                            fhir: FHIR_VERSION,
                            path: "/auth/authorize",
                            query: {
                                ...fullQuery,
                                launch: {
                                    auth_error: errorName
                                }
                            }
                        });
        
                        return request(app)
                        .get(url.pathname)
                        .query(url.searchParams.toString())
                        .expect(302)
                        .expect("location", authErrors[errorName])
                        // .expect(function(res) {
                        //     const loc = res.get("location");
                        //     if (!loc || loc.indexOf(`error=${authErrors[errorName]}`) == -1) {
                        //         throw new Error(`No error passed to the redirect ${loc}`)
                        //     }
                        //     if (!loc || loc.indexOf("state=x") == -1) {
                        //         throw new Error(`No state passed to the redirect ${loc}`)
                        //     }
                        // });
                    });
                })

                // rejects invalid audience value
                // -------------------------------------------------------------
                it ("rejects invalid audience value", () => {
                    return request(app)
                    .get(url.pathname)
                    .query({ ...fullQuery, aud: "whatever" })
                    .expect(302)
                    .expect("location", /error_description=Bad\+audience\+value/)
                });

                // can show encounter picker
                // -------------------------------------------------------------
                it ("can show encounter picker", () => {
                    const url = buildUrl({
                        fhir: FHIR_VERSION,
                        path: "/auth/authorize",
                        query: {
                            ...fullQuery,
                            scope: "patient/*.read launch",
                            patient: "whatever",
                            aud: config.baseUrl + `/v/${FHIR_VERSION}/fhir`,
                            launch: {
                                launch_ehr: 1,
                                select_encounter: 1
                            }
                        }
                    });

                    return request(app)
                    .get(url.pathname)
                    .query(url.searchParams.toString())
                    .expect(302)
                    .expect(res => {
                        const loc = res.get("location");
                        if (!loc || loc.indexOf(`/v/${FHIR_VERSION}/encounter?`) !== 0) {
                            throw new Error(`Wrong redirect ${loc}.`)
                        }
                    });
                });

                it("generates a code from profile", async () => {
                    return getAuthCode({
                        patient: "abc",
                        scope: "profile openid launch",
                        encounter: "bcd",
                        login_success: true,
                        auth_success: true,
                        launch: { launch_pt: 1 }
                    });
                });

                it("generates a code from fhirUser", async () => {
                    return getAuthCode({
                        patient: "abc",
                        scope: "fhirUser openid launch",
                        encounter: "bcd",
                        login_success: true,
                        auth_success: true,
                        launch: { launch_pt: 1 }
                    });
                });

                it ("shows patient picker if needed", () => {
                    const url = buildUrl({
                        fhir: FHIR_VERSION,
                        path: "/auth/authorize",
                        query: {
                            ...fullQuery,
                            scope: "launch",
                            aud: config.baseUrl + `/v/${FHIR_VERSION}/fhir`,
                            launch: {
                                launch_ehr: 1
                            }
                        }
                    });

                    return request(app)
                    .get(url.pathname)
                    .query(url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/picker\?/)
                });

                it ("shows patient picker if needed", () => {
                    const url = buildUrl({
                        fhir: FHIR_VERSION,
                        path: "/auth/authorize",
                        query: {
                            ...fullQuery,
                            scope: "launch",
                            aud: config.baseUrl + `/v/${FHIR_VERSION}/fhir`,
                            launch: {
                                launch_ehr: 1
                            }
                        }
                    });

                    return request(app)
                    .get(url.pathname)
                    .query(url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/picker\?/)
                });

                it ("shows patient picker if multiple patients are pre-selected", () => {
                    const url = buildUrl({
                        fhir: FHIR_VERSION,
                        path: "/auth/authorize",
                        query: {
                            ...fullQuery,
                            scope: "launch/patient",
                            aud: config.baseUrl + `/v/${FHIR_VERSION}/fhir`,
                            launch: {
                                launch_prov: 1
                            }
                        }
                    });

                    return request(app)
                    .get(url.pathname)
                    .query(url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/picker\?/)
                });

                it ("shows patient picker if needed in CDS launch", () => {
                    const url = buildUrl({
                        fhir: FHIR_VERSION,
                        path: "/auth/authorize",
                        query: {
                            ...fullQuery,
                            scope: "launch/patient",
                            aud: config.baseUrl + `/v/${FHIR_VERSION}/fhir`,
                            launch: {
                                launch_cds: 1
                            }
                        }
                    });

                    return request(app)
                    .get(url.pathname)
                    .query(url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/picker\?/)
                });

                it ("does not show patient picker if scopes do not require it", () => {
                    const url = buildUrl({
                        fhir: FHIR_VERSION,
                        path: "/auth/authorize",
                        query: {
                            ...fullQuery,
                            scope: "whatever",
                            aud: config.baseUrl + `/v/${FHIR_VERSION}/fhir`
                        }
                    });

                    return request(app)
                    .get(url.pathname)
                    .query(url.searchParams.toString())
                    .expect(res => expect(!res.header.location || !res.header.location.match(/\/picker\?/)).to.equal(true))
                });

                it ("shows provider login screen if needed", () => {
                    const url = buildUrl({
                        fhir: FHIR_VERSION,
                        path: "/auth/authorize",
                        query: {
                            ...fullQuery,
                            scope: "launch openid profile",
                            aud: config.baseUrl + `/v/${FHIR_VERSION}/fhir`,
                            launch: {
                                patient: "X",
                                encounter: "x",
                                launch_ehr: 1
                            }
                        }
                    });

                    return request(app)
                    .get(url.pathname)
                    .query(url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/login\?/)
                });

                it("Works with POST", () => {
                    return getAuthCode({
                        scope : "offline_access",
                        method: "POST"
                    }).then(({ code }) => expect(code).to.have.length.greaterThan(10));
                });

                // PKCE
                // -------------------------------------------------------------
                it("validates the code_challenge_method parameter", async () => {
                    return getAuthCodeRaw({ code_challenge_method: "plain" })
                    .expect(302)
                    .then((res) => {
                        expect(res.get("location")).to.match(/Invalid\+code_challenge_method\+parameter/)
                    });
                });

                it("validates the code_challenge parameter", () => {
                    return getAuthCodeRaw({ code_challenge_method: "S256" })
                    .expect(302)
                    .then((res) => {
                        expect(res.get("location")).to.match(/Missing\+code_challenge\+parameter/)
                    });
                });

                it("fails with PKCE S256 and an invalid code_verifier", async () => {
                    const code_verifier = jose.util.base64url.encode(crypto.randomBytes(32));
                    const hash = crypto.createHash('sha256');
                    hash.update(code_verifier);
                    const code_challenge = jose.util.base64url.encode(hash.digest());
                    const { code, redirect_uri } = await getAuthCode({
                        code_challenge_method: "S256",
                        code_challenge,
                    });
                    await getAccessToken(code, redirect_uri, 'bad-verifier')
                        .expect(401)
                        .expect(/Invalid grant or Invalid PKCE Verifier/)
                });
        
                it("succeeds with PKCE S256 and an valid code_verifier", async () => {
                    const code_verifier = jose.util.base64url.encode(crypto.randomBytes(32));
                    const hash = crypto.createHash('sha256');
                    hash.update(code_verifier);
                    const code_challenge = jose.util.base64url.encode(hash.digest());
                    const { code, redirect_uri } = await getAuthCode({
                        code_challenge_method: "S256",
                        code_challenge,
                    });
                    return getAccessToken(code, redirect_uri, code_verifier).expect(200)
                });

            })

            describe('token', function() {

                it("rejects token requests with invalid redirect_uri param", async () => {

                    /** @type {{ code: any }} */
                    let { code } = await getAuthCode({
                        scope: "offline_access",
                        launch: {
                            launch_pt : 1,
                            skip_login: 1,
                            skip_auth : 1,
                            patient   : "abc",
                            encounter : "bcd"
                        }
                    })

                    code = jwt.decode(code);

                    expect(code).to.haveOwnProperty("redirect_uri");

                    await getAccessToken(code, "http://something.else").then(() => {
                        throw new Error("The token request should have failed")
                    }).catch(() => true)
                })

                it("can simulate expired refresh tokens", async () => {

                    const { code, redirect_uri } = await getAuthCode({
                        scope: "offline_access",
                        launch: {
                            launch_pt : 1,
                            skip_login: 1,
                            skip_auth : 1,
                            patient   : "abc",
                            encounter : "bcd",
                            auth_error: "token_expired_refresh_token"
                        }
                    })
                    
                    const tokenResponse = await getAccessToken(code, redirect_uri).then(res => res.body)

                    /**
                     * @type {object}
                     */
                    const refreshToken = jwt.decode(tokenResponse.refresh_token)

                    expect(refreshToken.auth_error).to.equal("token_expired_refresh_token")

                    return request(app)
                        .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/token" }).pathname)
                        .type("form")
                        .send({ grant_type: "refresh_token", refresh_token: tokenResponse.refresh_token })
                        .expect('Content-Type', /json/)
                        .expect(403, {error:"invalid_grant",error_description:"Expired refresh token"});
                });

                it("provides id_token", async () => {
                    const { code, redirect_uri } = await getAuthCode({
                        patient: "abc",
                        scope: "fhirUser openid launch",
                        encounter: "bcd",
                        login_success: true,
                        auth_success: true,
                        launch: {
                            launch_pt: 1    
                        }
                    });

                    const tokenResponse = await getAccessToken(code, redirect_uri).then(res => res.body)

                    expect(tokenResponse).to.have.property("id_token")
                });
            });

            it("the access token can be verified using the published public key", async () => {

                // Start by getting an id_token
                const { code, redirect_uri } = await getAuthCode({
                    patient: "abc",
                    scope: "fhirUser openid launch",
                    encounter: "bcd",
                    login_success: true,
                    auth_success: true,
                    launch: { launch_pt: 1 }
                });

                const { id_token } = await getAccessToken(code, redirect_uri).then(res => res.body)

                // Then get the jwks_uri from .well-known/openid-configuration
                const jwksUrl = await request(app)
                    .get(buildUrl({ fhir: FHIR_VERSION, path: ".well-known/openid-configuration" }).pathname)
                    .expect("content-type", /json/)
                    .expect(200)
                    .then(res => new URL(res.body.jwks_uri));

                // Then fetch the keys
                const keys = await request(app)
                    .get(jwksUrl.pathname)
                    .expect("content-type", /json/)
                    .expect(200)
                    .then(res => res.body.keys);

                const privateKey = (await jose.JWK.asKey(keys[0], "json")).toPEM();
                jwt.verify(id_token, privateKey, { algorithms: ["RS256"] });
            });

            describe('Confidential Clients', () => {

                let token = jwt.sign("whatever", config.jwtSecret);
                
                it ("can simulate auth_invalid_client_secret", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/token" }).pathname)
                    .type('form')
                    .set("Authorization", "Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz")
                    .send({
                        grant_type: "refresh_token",
                        auth_error: "auth_invalid_client_secret",
                        refresh_token: token
                    })
                    .expect({error:"invalid_client",error_description:"Simulated invalid client secret error"})
                    .expect(401);
                });

                it ("rejects empty auth header", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/token" }).pathname)
                    .type('form')
                    .set("Authorization", "Basic")
                    .send({
                        grant_type: "refresh_token",
                        refresh_token: token
                    })
                    .expect({error:"invalid_request",error_description:"The authorization header 'Basic' cannot be empty"})
                    .expect(401);
                });

                it ("rejects invalid auth header", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/token" }).pathname)
                    .type('form')
                    .set("Authorization", "Basic bXktYXB")
                    .send({
                        grant_type: "refresh_token",
                        refresh_token: token
                    })
                    .expect({ error: "invalid_request", error_description:"Bad authorization header 'Basic bXktYXB': The decoded header must contain '{client_id}:{client_secret}'" })
                    .expect(401);
                });
    
                it ("can simulate invalid token errors", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/token" }).pathname)
                    .type('form')
                    .set("Authorization", "Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz")
                    .send({
                        grant_type: "authorization_code",
                        code: jwt.sign({ auth_error:"token_invalid_token", redirect_uri: "x" }, config.jwtSecret),
                        redirect_uri: "x"
                    })
                    .expect({ error: "invalid_client", error_description: "Invalid token!" })
                    .expect(401);
                });
            })
        });

        describe('Introspection', () => {
            it("includes the introspect endpoint in the CapabilityStatement", async () => {
                await request(app)
                .get(buildUrl({ fhir: FHIR_VERSION, path: "/fhir/metadata" }).pathname)
                .expect(/json/)
                .expect(200)
                .then(response => {
                    const oauthUris = response.body.rest[0].security.extension.find(e => /StructureDefinition\/oauth-uris$/.test(e.url));
                    expect(oauthUris);
                    const introspection = oauthUris.extension.find(e => e.url === "introspect");
                    expect(introspection);
                    expect(new URL(introspection.valueUri).pathname).equal(buildUrl({ fhir: FHIR_VERSION, path: "/auth/introspect" }).pathname);
                })
            })

            it("requires authorization", async () => {
                await request(app)
                .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/introspect" }).pathname)
                .expect(401, "Authorization is required")
            })

            it("rejects invalid token", async () => {
                await request(app)
                .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/introspect" }).pathname)
                .set('Authorization', `Bearer invalidToken`)
                .expect(401)
            })

            it("requires token in the payload", async () => {
                const { code, redirect_uri } = await getAuthCode({
                    scope: "offline_access",
                    launch: {
                        launch_pt : 1,
                        skip_login: 1,
                        skip_auth : 1,
                        patient   : "abc",
                        encounter : "bcd",
                    }
                });
                
                const { access_token } = await getAccessToken(code, redirect_uri).then(res => res.body);

                await request(app)
                .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/introspect" }).pathname)
                .set('Authorization', `Bearer ${access_token}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(400, "No token provided")
            })

            it("can introspect an access token", async () => {
                const { code, redirect_uri } = await getAuthCode({
                    scope: "offline_access launch launch/patient openid fhirUser",
                    client_id: "example-client",
                    launch: {
                        launch_pt : 1,
                        skip_login: 1,
                        skip_auth : 1,
                        patient   : "abc",
                        encounter : "bcd",
                    }
                });
                
                const { access_token } = await getAccessToken(code, redirect_uri).then(res => res.body);

                await request(app)
                .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/introspect" }).pathname)
                .set('Authorization', `Bearer ${access_token}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({ token: access_token })
                .expect(200)
                .expect(({ body }) => {
                    expect(body.active).to.be.true;
                    expect(body.exp).to.exist;
                    expect(body.scope).to.exist;
                    expect(body.patient).to.equal("abc");
                    expect(body.client_id).to.equal("example-client");
                })
            })

            it("can introspect a refresh token", async () => {
                const { code, redirect_uri } = await getAuthCode({
                    scope: "offline_access",
                    launch: {
                        launch_pt : 1,
                        skip_login: 1,
                        skip_auth : 1,
                        patient   : "abc",
                        encounter : "bcd",
                    }
                });
                
                const { access_token, refresh_token } = await getAccessToken(code, redirect_uri).then(res => res.body);

                await request(app)
                .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/introspect" }).pathname)
                .set('Authorization', `Bearer ${access_token}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({ token: refresh_token })
                .expect(200)
                .expect(res => {
                    if(res.body.active !== true) throw new Error("Token is not active.");
                })
            })

            it("gets active: false for authorized request with invalid token", async () => {
                const { code, redirect_uri } = await getAuthCode({
                    scope: "offline_access",
                    launch: {
                        launch_pt : 1,
                        skip_login: 1,
                        skip_auth : 1,
                        patient   : "abc",
                        encounter : "bcd",
                    }
                });
                
                const { access_token } = await getAccessToken(code, redirect_uri).then(res => res.body);

                await request(app)
                .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/introspect" }).pathname)
                .set('Authorization', `Bearer ${access_token}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({ token: "invalid token" })
                .expect(200)
                .expect('content-type', /json/)
                .expect(({ body }) => {
                    expect(body.active).to.equal(false)
                    expect(body.error.name).to.equal("JsonWebTokenError")
                })
            })

            it("gets active: false for authorized request with expired token", async () => {

                const expiredTokenPayload = {
                    client_id: "mocked",
                    scope: "Patient/*.read",
                    exp: Math.floor(Date.now() / 1000) - (60 * 60) // token expired one hour ago
                }
    
                const expiredToken = jwt.sign(expiredTokenPayload, config.jwtSecret)

                const { code, redirect_uri } = await getAuthCode({
                    scope: "offline_access",
                    launch: {
                        launch_pt : 1,
                        skip_login: 1,
                        skip_auth : 1,
                        patient   : "abc",
                        encounter : "bcd",
                    }
                });
                
                const { access_token } = await getAccessToken(code, redirect_uri).then(res => res.body);

                await request(app)
                .post(buildUrl({ fhir: FHIR_VERSION, path: "auth/introspect" }).pathname)
                .set('Authorization', `Bearer ${access_token}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({ token: expiredToken })
                .expect(200)
                .expect('content-type', /json/)
                .expect(({ body }) => {
                    expect(body.active).to.equal(false)
                    expect(body.error.name).to.equal("TokenExpiredError")
                })
            })
        })

        describe('Backend Services', () => {

            describe('Client Registration', () => {
        
                it ("requires form-urlencoded POST", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/register" }).pathname)
                    .send({})
                    .expect(400, { error: "invalid_request", error_description: "Invalid request content-type header (must be 'application/x-www-form-urlencoded')" })
                });
        
                it ("requires 'iss' parameter", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/register" }).pathname)
                    .type("form")
                    .send({})
                    .expect(400, { error: "invalid_request", error_description: 'Missing parameter "iss"' })
                });
        
                it ("requires 'pub_key' parameter", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/register" }).pathname)
                    .type("form")
                    .send({ iss: "whatever" })
                    .expect(400, { error: "invalid_request", error_description: 'Missing parameter "pub_key"' })
                });
        
                it ("validates the 'dur' parameter", () => {
                    return Promise.all(
                        ["x", Infinity, -Infinity, -2].map(dur => {
                            return request(app)
                            .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/register" }).pathname)
                            .type("form")
                            .send({ iss: "whatever", pub_key: "abc", dur })
                            .expect(400, { error: "invalid_request", error_description: 'Invalid parameter "dur"' });
                        })
                    )
                });
        
                it ("basic usage", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/register" }).pathname)
                    .type("form")
                    .send({ iss: "whatever", pub_key: "something" })
                    .expect(200)
                    .expect("content-type", /\btext\/plain\b/i)
                    .expect(res => expect(jwt.decode(res.text)).to.not.be.null);
                });
        
                it ("accepts custom duration", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/register" }).pathname)
                    .type("form")
                    .send({ iss: "whatever", pub_key: "something", dur: 23 })
                    .expect(200)
                    .expect("content-type", /\btext\/plain\b/i)
                    // @ts-ignore
                    .expect(res => expect(jwt.decode(res.text).accessTokensExpireIn).to.equal(23))
                });
        
                it ("accepts custom simulated errors", () => {
                    return request(app)
                    .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/register" }).pathname)
                    .type("form")
                    .send({ iss: "whatever", pub_key: "something", auth_error: "test error" })
                    .expect(200)
                    .expect("content-type", /\btext\/plain\b/i)
                    // @ts-ignore
                    .expect(res => expect(jwt.decode(res.text).auth_error).to.equal("test error"))
                });
            });
        
            it ("Authorization Claim works as expected", async () => {
                const iss = "whatever";
                const tokenUrl = buildUrl({ fhir: FHIR_VERSION, path: "/auth/token" });

                const alg = "RS384"
                const key = await jose.JWK.createKey("RSA", 2048, { alg })

                const token = await request(app)
                .post(buildUrl({ fhir: FHIR_VERSION, path: "/auth/register" }).pathname)
                .type("form")
                .send({ iss, pub_key: key.toPEM() })
                .then(res => res.text);

                let jwtToken = {
                    iss,
                    sub: token,
                    aud: tokenUrl.href,
                    exp: Date.now()/1000 + 300, // 5 min
                    jti: crypto.randomBytes(32).toString("hex")
                };
            
                await request(app)
                .post(tokenUrl.pathname)
                .type("form")
                .send({
                    scope: "system/*.*",
                    grant_type: "client_credentials",
                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                    client_assertion: jwt.sign(
                        jwtToken,
                        key.toPEM(true),
                        { algorithm: alg }
                    )
                })
                .then(res => {
                    // console.log(res.text)
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
                })
            });
        });
    })
}


