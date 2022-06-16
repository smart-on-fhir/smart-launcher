const request    = require('supertest')
const jwt        = require("jsonwebtoken")
const crypto     = require("crypto")
const { expect } = require("chai")
const jose       = require("node-jose")
const app        = require("../src/index.js")
const config     = require("../src/config")

const agent = request(app);

const TESTED_FHIR_SERVERS = {
    "r4": config.fhirServerR4,
    "r3": config.fhirServerR3,
    "r2": config.fhirServerR2
};

for(const FHIR_VERSION in TESTED_FHIR_SERVERS) {

    const BASE_URL              = config.baseUrl
    const PATH_REGISTER         = `/v/${FHIR_VERSION}/auth/register`
    const PATH_AUTHORIZE        = `/v/${FHIR_VERSION}/auth/authorize`
    const PATH_TOKEN            = `/v/${FHIR_VERSION}/auth/token`
    const PATH_INTROSPECT       = `/v/${FHIR_VERSION}/auth/introspect`
    const PATH_FHIR             = `/v/${FHIR_VERSION}/fhir`
    const PATH_WELL_KNOWN_SMART = `/v/${FHIR_VERSION}/fhir/.well-known/smart-configuration`
    const PATH_WELL_KNOWN_OIDC  = `/v/${FHIR_VERSION}/fhir/.well-known/openid-configuration`
    const PATH_PATIENT_PICKER   = `/v/${FHIR_VERSION}/picker`
    const PATH_LOGIN_PAGE       = `/v/${FHIR_VERSION}/login`
    const URI_FHIR              = `${BASE_URL}${PATH_FHIR}`

    /**
     * @param {string} path
     * @param {object} [query]
     * @param {string|object} [sim]
     */
    function url(path, query = {}, sim = "") {

        let _path = "/v/" + FHIR_VERSION;

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
     * @param {string} code 
     * @param {string} redirect_uri
     * @param {string} [code_verifier]
     * @returns {import('supertest').Test}
     */
    function getAccessToken(code, redirect_uri, code_verifier) {
        return agent.post(PATH_TOKEN)
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
            aud          : URI_FHIR,
            response_type: "code"
        }

        if (options.code_challenge_method) {
            query.code_challenge_method = options.code_challenge_method
        }

        if (options.code_challenge) {
            query.code_challenge = options.code_challenge
        }

        const _url = url("/auth/authorize", query);

        if (options.method === "POST") {
            return request(app).post(_url.pathname).type("form").send(query).redirects(0);
        }

        return request(app).get(_url.pathname).query(_url.searchParams.toString()).redirects(0)
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

    describe(`FHIR server ${FHIR_VERSION}`, () => {

        it('can render the patient picker', () => {
            return agent.get(PATH_PATIENT_PICKER)
            .expect('Content-Type', /html/)
            .expect(200)
        });

        it('can render the user picker', () => {
            return agent.get(PATH_LOGIN_PAGE)
            .expect('Content-Type', /html/)
            .expect(200)
        });

        it('can render the launch approval dialog', () => {
            return agent.get(url("/authorize").pathname)
            .expect('Content-Type', /html/)
            .expect(200)
        });

        it (`renders ${PATH_WELL_KNOWN_SMART}`, async () => {
            return agent.get(PATH_WELL_KNOWN_SMART)
            .expect('Content-Type', /json/)
            .expect(200)
        })

        describe('Auth', () => {
            describe('authorize', () => {
                
                const fullQuery = {
                    response_type: "code",
                    client_id: "x",
                    redirect_uri: "http://x",
                    scope: "x",
                    state: "x",
                    aud: "x"
                };

                const authErrors = {
                    "auth_invalid_client_id": /error_description=Simulated\+invalid\+client_id\+parameter\+error/,
                    "auth_invalid_scope"    : /error_description=Simulated\+invalid\+scope\+error/
                }

                it(`requires "response_type" param`, () => {
                    const query = { ...fullQuery };
                    // @ts-ignore
                    delete query.response_type
                    return agent.get(PATH_AUTHORIZE)
                    .query(query)
                    .expect(302)
                    .expect("location", /error_description=Missing\+response_type\+parameter/)
                    .expect("location", /state=x/)
                });

                it(`requires "redirect_uri" param`, () => {
                    const query = { ...fullQuery };
                    // @ts-ignore
                    delete query.redirect_uri
                    return agent.get(PATH_AUTHORIZE)
                    .query(query)
                    .expect(400)
                    .expect({ error: "invalid_request", error_description: "Missing redirect_uri parameter" })
                });

                // validates the redirect_uri parameter
                // -------------------------------------------------------------
                it("validates the redirect_uri parameter", () => {
                    return agent.get(PATH_AUTHORIZE)
                    .query({ ...fullQuery, redirect_uri: "x" })
                    .expect({ error: "invalid_request", error_description: "Invalid redirect_uri parameter 'x' (must be full URL)" })
                    .expect(400);
                });

                it (`can simulate invalid_redirect_uri error`, () => {

                    const _url = url("/auth/authorize", {}, { auth_error: "auth_invalid_redirect_uri" });
    
                    return agent.get(_url.pathname)
                    .query(fullQuery)
                    .expect(400)
                    .expect({ error:"invalid_request", error_description:"Simulated invalid redirect_uri parameter error" })
                });

                // other simulated errors
                // -------------------------------------------------------------
                Object.keys(authErrors).forEach(errorName => {
                    it (`can simulate "${errorName}" error via sim`, () => {

                        const _url = url("/auth/authorize", {}, { auth_error: errorName });
        
                        return agent.get(_url.pathname)
                        .query(fullQuery)
                        .expect(302)
                        .expect("location", authErrors[errorName])
                    });

                    it (`can simulate "${errorName}" error via launch param`, () => {
                        const _url = url("/auth/authorize", {
                            ...fullQuery,
                            launch: {
                                auth_error: errorName
                            }
                        });
        
                        return agent.get(_url.pathname)
                        .query(_url.searchParams.toString())
                        .expect(302)
                        .expect("location", authErrors[errorName]);
                    });
                })

                // rejects invalid audience value
                // -------------------------------------------------------------
                it ("rejects invalid audience value", () => {
                    return agent.get(PATH_AUTHORIZE)
                    .query({ ...fullQuery, aud: "whatever" })
                    .expect(302)
                    .expect("location", /error_description=Bad\+audience\+value/)
                });

                // can show encounter picker
                // -------------------------------------------------------------
                it ("can show encounter picker", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "patient/*.read launch",
                        patient: "whatever",
                        aud: URI_FHIR,
                        launch: {
                            launch_ehr: 1,
                            select_encounter: 1
                        }
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
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

                it ("shows patient login if needed", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch",
                        aud: URI_FHIR,
                        launch: {
                            launch_pt: 1
                        }
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/login\?/)
                });

                it ("shows the 'authorize launch' screen if needed", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch",
                        aud: URI_FHIR,
                        launch: {
                            launch_prov: 1,
                            encounter: "e",
                            aud_validated: true,
                        }
                    }, {
                        launch_prov: true,
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/authorize\?/)
                });

                it ("shows patient picker if needed", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch",
                        aud: URI_FHIR,
                        launch: {
                            launch_ehr: 1
                        }
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/picker\?/)
                });

                it ("shows patient picker if needed", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch",
                        aud: URI_FHIR,
                        launch: {
                            launch_ehr: 1
                        }
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/picker\?/)
                });

                it ("shows patient picker if multiple patients are pre-selected", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch/patient",
                        aud: URI_FHIR,
                        launch: {
                            launch_prov: 1
                        }
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/picker\?/)
                });

                it ("shows patient picker if needed in CDS launch", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch/patient",
                        aud: URI_FHIR,
                        launch: {
                            launch_cds: 1
                        }
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/picker\?/)
                });

                it ("does not show patient picker if scopes do not require it", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "whatever",
                        aud: URI_FHIR
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
                    .expect(res => expect(!res.header.location || !res.header.location.match(/\/picker\?/)).to.equal(true))
                });

                it ("shows provider login screen if needed", () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch openid profile",
                        aud: URI_FHIR,
                        launch: {
                            patient: "X",
                            encounter: "x",
                            launch_ehr: 1
                        }
                    });

                    return agent.get(_url.pathname)
                    .query(_url.searchParams.toString())
                    .expect(302)
                    .expect("location", /\/login\?/)
                });

                // it("Works with POST", () => {
                //     return getAuthCode({
                //         scope : "offline_access",
                //         method: "POST"
                //     }).then(({ code }) => expect(code).to.have.length.greaterThan(10));
                // });

                // PKCE
                // -------------------------------------------------------------
                // it("validates the code_challenge_method parameter", async () => {
                //     return getAuthCodeRaw({ code_challenge_method: "plain" })
                //     .expect(302)
                //     .then((res) => {
                //         expect(res.get("location")).to.match(/Invalid\+code_challenge_method\+parameter/)
                //     });
                // });

                // it("validates the code_challenge parameter", () => {
                //     return getAuthCodeRaw({ code_challenge_method: "S256" })
                //     .expect(302)
                //     .then((res) => {
                //         expect(res.get("location")).to.match(/Missing\+code_challenge\+parameter/)
                //     });
                // });

                // it("fails with PKCE S256 and an invalid code_verifier", async () => {
                //     const code_verifier = jose.util.base64url.encode(crypto.randomBytes(32));
                //     const hash = crypto.createHash('sha256');
                //     hash.update(code_verifier);
                //     const code_challenge = jose.util.base64url.encode(hash.digest());
                //     const { code, redirect_uri } = await getAuthCode({
                //         code_challenge_method: "S256",
                //         code_challenge,
                //     });
                //     await getAccessToken(code, redirect_uri, 'bad-verifier')
                //         .expect(401)
                //         .expect(/Invalid grant or Invalid PKCE Verifier/)
                // });
        
                // it("succeeds with PKCE S256 and an valid code_verifier", async () => {
                //     const code_verifier = jose.util.base64url.encode(crypto.randomBytes(32));
                //     const hash = crypto.createHash('sha256');
                //     hash.update(code_verifier);
                //     const code_challenge = jose.util.base64url.encode(hash.digest());
                //     const { code, redirect_uri } = await getAuthCode({
                //         code_challenge_method: "S256",
                //         code_challenge,
                //     });
                //     return getAccessToken(code, redirect_uri, code_verifier).expect(200)
                // });

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

                    return agent.post(PATH_TOKEN)
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

                    const idToken = jwt.verify(tokenResponse.id_token, config.privateKeyAsPem, { algorithms: ["RS256"] });

                    expect(idToken).to.have.property("iss")
                    // @ts-ignore Supertest runs on random port thus we need to use regexp
                    expect(idToken.iss).to.match(/^http\:\/\/127\.0\.0\.1\:\d+\/v\/r\d\/fhir$/)
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
                const jwksUrl = await agent.get(PATH_WELL_KNOWN_OIDC)
                    .expect("content-type", /json/)
                    .expect(200)
                    .then(res => new URL(res.body.jwks_uri));

                // Then fetch the keys
                const keys = await agent.get(jwksUrl.pathname)
                    .expect("content-type", /json/)
                    .expect(200)
                    .then(res => res.body.keys);

                const privateKey = (await jose.JWK.asKey(keys[0], "json")).toPEM();
                jwt.verify(id_token, privateKey, { algorithms: ["RS256"] });
            });

            describe('Confidential Clients', () => {

                let token = jwt.sign("whatever", config.jwtSecret);
                
                it ("can simulate auth_invalid_client_secret", () => {
                    return agent.post(PATH_TOKEN)
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
                    return agent.post(PATH_TOKEN)
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
                    return agent.post(PATH_TOKEN)
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
                    return agent.post(PATH_TOKEN)
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

        describe('Introspection', function() {

            it("requires authorization", async () => {
                await agent.post(PATH_INTROSPECT)
                .expect(401, "Authorization is required")
            })

            it("rejects invalid token", async () => {
                await agent.post(PATH_INTROSPECT)
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

                await agent.post(PATH_INTROSPECT)
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

                await agent.post(PATH_INTROSPECT)
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

                await agent.post(PATH_INTROSPECT)
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

                await agent.post(PATH_INTROSPECT)
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

                await agent.post(PATH_INTROSPECT)
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
                    return agent.post(PATH_REGISTER).send({}).expect(400, {
                        error: "invalid_request",
                        error_description: "Invalid request content-type header (must be 'application/x-www-form-urlencoded')"
                    })
                });
        
                it ("requires 'iss' parameter", () => {
                    return agent.post(PATH_REGISTER).type("form").send({})
                        .expect(400, { error: "invalid_request", error_description: 'Missing parameter "iss"' })
                });
        
                it ("requires 'pub_key' parameter", () => {
                    return agent.post(PATH_REGISTER).type("form").send({ iss: "whatever" })
                        .expect(400, { error: "invalid_request", error_description: 'Missing parameter "pub_key"' })
                });
        
                it ("validates the 'dur' parameter", () => {
                    return Promise.all(
                        ["x", Infinity, -Infinity, -2].map(dur => {
                            return agent.post(PATH_REGISTER).type("form").send({ iss: "whatever", pub_key: "abc", dur })
                                .expect(400, { error: "invalid_request", error_description: 'Invalid parameter "dur"' });
                        })
                    )
                });
        
                it ("basic usage", () => {
                    return agent.post(PATH_REGISTER)
                    .type("form")
                    .send({ iss: "whatever", pub_key: "something" })
                    .expect(200)
                    .expect("content-type", /\btext\/plain\b/i)
                    .expect(res => expect(jwt.decode(res.text)).to.not.be.null);
                });
        
                it ("accepts custom duration", () => {
                    return agent.post(PATH_REGISTER)
                    .type("form")
                    .send({ iss: "whatever", pub_key: "something", dur: 23 })
                    .expect(200)
                    .expect("content-type", /\btext\/plain\b/i)
                    // @ts-ignore
                    .expect(res => expect(jwt.decode(res.text).accessTokensExpireIn).to.equal(23))
                });
        
                it ("accepts custom simulated errors", () => {
                    return agent.post(PATH_REGISTER)
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
                const tokenUrl = url("/auth/token");

                const alg = "RS384"
                const key = await jose.JWK.createKey("RSA", 2048, { alg })

                const token = await agent.post(PATH_REGISTER)
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
            
                await agent.post(tokenUrl.pathname)
                .type("form")
                .send({
                    scope: "system/*.*",
                    grant_type: "client_credentials",
                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                    client_assertion: jwt.sign(jwtToken, key.toPEM(true), { algorithm: alg })
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


