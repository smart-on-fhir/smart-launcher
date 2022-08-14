const jwt          = require("jsonwebtoken")
const crypto       = require("crypto")
const { expect }   = require("chai")
const jose         = require("node-jose")
const { BASE_URL } = require("./testSetup")
const config       = require("../src/config")


/**
 * 
 * @param {string|URL} url 
 * @param {RequestInit} [options] 
 * @returns 
 */
const request = (url, options) => {
    if (typeof url === "string" && !url.startsWith("http")) {
        url = new URL(url, BASE_URL)
    }
    return fetch(url, options).catch(e => {
        console.warn(`Failed fetching ${url}`)
        console.log(e.cause)
        throw e
    })
}

const TESTED_FHIR_SERVERS = {
    "r4": config.fhirServerR4,
    "r3": config.fhirServerR3,
    "r2": config.fhirServerR2
};

for(const FHIR_VERSION in TESTED_FHIR_SERVERS) {

    const URI_FHIR = url("/fhir")

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

        const url = new URL(path, BASE_URL)

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
     * @returns {Promise<Response>}
     */
    async function getAccessToken(code, redirect_uri, code_verifier) {
        const formData = new URLSearchParams()
        formData.set("grant_type", "authorization_code")
        formData.set("code", code)
        formData.set("redirect_uri", redirect_uri)
        if (code_verifier) {
            formData.set("code_verifier", code_verifier)
        }

        return request(url("/auth/token"), {
            method: "POST",
            body: formData,
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            }
        })
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
     * @returns { Promise<Response> }
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

        if (options.method === "POST") {
            const formData = new URLSearchParams()
            for (let key in query) {
                formData.set(key, query[key])
            }

            return request(url("/auth/authorize"), {
                method: "POST",
                body: formData,
                redirect: "manual",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                }
            });
        }
        
        return request(url("/auth/authorize", query), { redirect: "manual" })
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
    async function getAuthCode(options)
    {
        const res = await getAuthCodeRaw(options)
        expect(res.status).to.equal(302)
        
        const loc = new URL(res.headers.get("location") || "");
        expect(loc).to.exist;
        expect(loc.href).to.match(/^https?\:\/\/.+/)
        
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
    }

    describe(`FHIR server ${FHIR_VERSION}`, () => {

        it ('can render the patient picker', async () => {
            const res = await request(url("/picker"))
            expect(res.headers.get('content-type')).to.match(/html/)
            expect(res.status).to.equal(200)
        });

        it ('can render the user picker', async () => {
            const res = await request(url("/login"))
            expect(res.headers.get('content-type')).to.match(/html/)
            expect(res.status).to.equal(200)
        });

        it ('can render the launch approval dialog', async () => {
            const res = await request(url("/authorize").pathname)
            expect(res.headers.get('content-type')).to.match(/html/)
            expect(res.status).to.equal(200)
        });

        it (`renders /fhir/.well-known/smart-configuration`, async () => {
            const res = await request(url("/fhir/.well-known/smart-configuration"))
            expect(res.headers.get('content-type')).to.match(/json/)
            expect(res.status).to.equal(200)

            const json = await res.json()
            expect(json).to.be.an("Object")
            expect(json.capabilities).to.be.an("Array")
            
            // SMART v2
            expect(json.capabilities).to.include("authorize-post")

            // PKCE
            expect(json.code_challenge_methods_supported).to.be.an("Array")
            expect(json.code_challenge_methods_supported).to.include("S256")
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

                it (`requires "response_type" param`, async () => {
                    const query = { ...fullQuery };
                    // @ts-ignore
                    delete query.response_type
                    const res = await request(url("/auth/authorize", query), { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.match(/error_description=Missing\+response_type\+parameter/)
                    expect(res.headers.get("location")).to.match(/state=x/)
                });

                it (`requires "redirect_uri" param`, async () => {
                    const query = { ...fullQuery };
                    // @ts-ignore
                    delete query.redirect_uri
                    const res = await request(url("/auth/authorize", query), { redirect: "manual" })
                    expect(res.status).to.equal(400)
                    const body = await res.json()
                    expect(body).to.deep.equal({
                        error: "invalid_request",
                        error_description: "Missing redirect_uri parameter"
                    })
                });

                // validates the redirect_uri parameter
                // -------------------------------------------------------------
                it ("validates the redirect_uri parameter", async () => {
                    const res = await request(
                        url("/auth/authorize", { ...fullQuery, redirect_uri: "x" }),
                        { redirect: "manual" }
                    );
                    expect(res.status).to.equal(400)
                    const body = await res.json()
                    expect(body).to.deep.equal({
                        error: "invalid_request",
                        error_description: "Bad redirect_uri: Invalid URL"
                    })
                });

                it (`can simulate invalid_redirect_uri error`, async () => {
                    const _url = url("/auth/authorize", fullQuery, { auth_error: "auth_invalid_redirect_uri" });
                    const res = await request(_url.pathname)
                    expect(res.status).to.equal(400)
                    expect(await res.json()).to.deep.equal({
                        error:"invalid_request",
                        error_description:"Simulated invalid redirect_uri parameter error"
                    })
                });

                // other simulated errors
                // -------------------------------------------------------------
                Object.keys(authErrors).forEach(errorName => {
                    
                    it (`can simulate "${errorName}" error via sim`, async () => {
                        const res = await request(
                            url("/auth/authorize", fullQuery, { auth_error: errorName }),
                            { redirect: "manual" }
                        );
                        
                        expect(res.status).to.equal(302)
                        expect(res.headers.get("location")).to.match(authErrors[errorName])
                    });

                    it (`can simulate "${errorName}" error via launch param`, async () => {

                        const res = await request(
                            url("/auth/authorize", {
                                ...fullQuery,
                                launch: {
                                    auth_error: errorName
                                }
                            }),
                            { redirect: "manual" }
                        );
                        
                        expect(res.status).to.equal(302)
                        expect(res.headers.get("location")).to.match(authErrors[errorName])
                    });
                })

                // rejects invalid audience value
                // -------------------------------------------------------------
                it ("rejects invalid audience value", async () => {
                    const res = await request(url("/auth/authorize", { ...fullQuery, aud: "whatever" }), { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.match(/error_description=Bad\+audience\+value/)
                });

                // can show encounter picker
                // -------------------------------------------------------------
                it ("can show encounter picker", async () => {
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

                    const res = await request(_url, { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.include(`/v/${FHIR_VERSION}/encounter?`)
                });

                it ("generates a code from profile", async () => {
                    return getAuthCode({
                        patient: "abc",
                        scope: "profile openid launch",
                        encounter: "bcd",
                        login_success: true,
                        auth_success: true,
                        launch: { launch_pt: 1 }
                    });
                });

                it ("generates a code from fhirUser", async () => {
                    return getAuthCode({
                        patient: "abc",
                        scope: "fhirUser openid launch",
                        encounter: "bcd",
                        login_success: true,
                        auth_success: true,
                        launch: { launch_pt: 1 }
                    });
                });

                it ("shows patient login if needed", async () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch",
                        aud: URI_FHIR,
                        launch: {
                            launch_pt: 1
                        }
                    });
                    const res = await request(_url, { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.match(/\/login\?/)
                });

                it ("shows the 'authorize launch' screen if needed", async () => {
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

                    const res = await request(_url, { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.match(/\/authorize\?/)
                });

                it ("shows patient picker if needed", async () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch",
                        aud: URI_FHIR,
                        launch: {
                            launch_ehr: 1
                        }
                    });

                    const res = await request(_url, { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.match(/\/picker\?/)
                });

                it ("shows patient picker if multiple patients are pre-selected", async () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch/patient",
                        aud: URI_FHIR,
                        launch: {
                            launch_prov: 1
                        }
                    });

                    const res = await request(_url, { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.match(/\/picker\?/)
                });

                it ("shows patient picker if needed in CDS launch", async () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "launch/patient",
                        aud: URI_FHIR,
                        launch: {
                            launch_cds: 1
                        }
                    });

                    const res = await request(_url, { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.match(/\/picker\?/)
                });

                it ("does not show patient picker if scopes do not require it", async () => {
                    const _url = url("/auth/authorize", {
                        ...fullQuery,
                        scope: "whatever",
                        aud: URI_FHIR
                    });

                    const res = await request(_url, { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location") || "").not.to.match(/\/picker\?/)
                });

                it ("shows provider login screen if needed", async () => {
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

                    const res = await request(_url, { redirect: "manual" })
                    expect(res.status).to.equal(302)
                    expect(res.headers.get("location")).to.match(/\/login\?/)
                });

                it ("Works with POST", async () => {
                    const { code } = await getAuthCode({
                        scope : "offline_access",
                        method: "POST"
                    })
                    expect(code).to.have.length.greaterThan(10);
                });

                // PKCE
                // -------------------------------------------------------------
                it ("validates the code_challenge_method parameter", async () => {
                    const res = await getAuthCodeRaw({ code_challenge_method: "plain" })
                    expect(res.status).to.equal(302)
                    const url = new URL(res.headers.get("location") + "")
                    expect(url.searchParams.get("error")).to.equal("invalid_request")
                    expect(url.searchParams.get("error_description")).to.equal("Invalid code_challenge_method. Must be S256.")
                });

                it ("validates the code_challenge parameter", async () => {
                    const res = await getAuthCodeRaw({ code_challenge_method: "S256" })
                    expect(res.status).to.equal(302)
                    const url = new URL(res.headers.get("location") + "")
                    expect(url.searchParams.get("error")).to.equal("invalid_request")
                    expect(url.searchParams.get("error_description")).to.equal("Missing code_challenge parameter")
                });

                it ("fails with PKCE S256 and an invalid code_verifier", async () => {
                    const code_verifier = jose.util.base64url.encode(crypto.randomBytes(32));
                    const hash = crypto.createHash('sha256');
                    hash.update(code_verifier);
                    const code_challenge = jose.util.base64url.encode(hash.digest());
                    const { code, redirect_uri } = await getAuthCode({
                        code_challenge_method: "S256",
                        code_challenge,
                    });
                    const res = await getAccessToken(code, redirect_uri, 'bad-verifier')
                    expect(res.status).to.equal(401)
                    expect(await res.text()).to.match(/Invalid grant or Invalid PKCE Verifier/)
                });
        
                it ("succeeds with PKCE S256 and an valid code_verifier", async () => {
                    const code_verifier = jose.util.base64url.encode(crypto.randomBytes(32));
                    const hash = crypto.createHash('sha256');
                    hash.update(code_verifier);
                    const code_challenge = jose.util.base64url.encode(hash.digest());
                    const { code, redirect_uri } = await getAuthCode({
                        code_challenge_method: "S256",
                        code_challenge,
                    });
                    const res = await getAccessToken(code, redirect_uri, code_verifier)
                    expect(res.status).to.equal(200)
                });

            })

            describe('token', function() {

                it ("rejects token requests with invalid redirect_uri param", async () => {

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

                it ("can simulate expired refresh tokens", async () => {

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
                    
                    const tokenResponse = await getAccessToken(code, redirect_uri).then(res => res.json())

                    /**
                     * @type {object}
                     */
                    const refreshToken = jwt.decode(tokenResponse.refresh_token)

                    expect(refreshToken.auth_error).to.equal("token_expired_refresh_token")

                    const body = new URLSearchParams()
                    body.set("grant_type", "refresh_token")
                    body.set("refresh_token", tokenResponse.refresh_token)

                    const res = await request(url("/auth/token"), {
                        method: "POST",
                        body,
                        headers: {
                            "content-type": "application/x-www-form-urlencoded"
                        }
                    })

                    expect(res.status).to.equal(403)
                    const json = await res.json()
                    expect(json).to.deep.equal({error:"invalid_grant",error_description:"Expired refresh token"})
                });

                it ("provides id_token", async () => {
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

                    const tokenResponse = await getAccessToken(code, redirect_uri).then(res => res.json())

                    expect(tokenResponse).to.have.property("id_token")

                    const idToken = jwt.verify(tokenResponse.id_token, config.privateKeyAsPem, { algorithms: ["RS256"] });

                    expect(idToken).to.have.property("iss")
                    // @ts-ignore Supertest runs on random port thus we need to use regexp
                    expect(idToken.iss).to.match(/^http\:\/\/localhost\:\d+\/v\/r\d\/fhir$/)
                });
            });

            it ("the access token can be verified using the published public key", async () => {

                // Start by getting an id_token
                const { code, redirect_uri } = await getAuthCode({
                    patient: "abc",
                    scope: "fhirUser openid launch",
                    encounter: "bcd",
                    login_success: true,
                    auth_success: true,
                    launch: { launch_pt: 1 }
                });

                const { id_token } = await getAccessToken(code, redirect_uri).then(res => res.json())

                // Then get the jwks_uri from .well-known/openid-configuration
                const wellKnown = await request(url("/fhir/.well-known/openid-configuration"))
                expect(wellKnown.status).to.equal(200)
                expect(wellKnown.headers.get("content-type")).to.match(/json/)
                const jwksUrl = await wellKnown.json().then(j => new URL(j.jwks_uri));

                // Then fetch the keys
                const k = await request(BASE_URL + jwksUrl.pathname)
                expect(k.status).to.equal(200)
                expect(k.headers.get("content-type")).to.match(/json/)
                const body = await k.json()
                const privateKey = (await jose.JWK.asKey(body.keys[0], "json")).toPEM();
                jwt.verify(id_token, privateKey, { algorithms: ["RS256"] });
            });

            describe('Confidential Clients', () => {

                let token = jwt.sign("whatever", config.jwtSecret);
                
                it ("can simulate auth_invalid_client_secret", async () => {
                    const body = new URLSearchParams()
                    body.set("grant_type", "refresh_token")
                    body.set("auth_error", "auth_invalid_client_secret")
                    body.set("refresh_token", token)

                    const res = await request(url("/auth/token"), {
                        method: "POST",
                        body,
                        headers: {
                            "content-type" : "application/x-www-form-urlencoded",
                            "Authorization": "Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz"
                        }  
                    })

                    expect(res.status).to.equal(401)
                    expect(await res.json()).to.deep.equal({
                        error: "invalid_client",
                        error_description: "Simulated invalid client secret error"
                    })
                });

                it ("rejects empty auth header", async () => {
                    const body = new URLSearchParams()
                    body.set("grant_type", "refresh_token")
                    body.set("refresh_token", token)

                    const res = await request(url("/auth/token"), {
                        method: "POST",
                        body,
                        headers: {
                            "content-type" : "application/x-www-form-urlencoded",
                            "Authorization": "Basic"
                        }  
                    })

                    expect(res.status).to.equal(401)
                    expect(await res.json()).to.deep.equal({
                        error: "invalid_request",
                        error_description: "The authorization header 'Basic' cannot be empty"
                    })
                });

                it ("rejects invalid auth header", async () => {
                    const body = new URLSearchParams()
                    body.set("grant_type", "refresh_token")
                    body.set("refresh_token", token)

                    const res = await request(url("/auth/token"), {
                        method: "POST",
                        body,
                        headers: {
                            "content-type" : "application/x-www-form-urlencoded",
                            "Authorization": "Basic bXktYXB"
                        }  
                    })

                    expect(res.status).to.equal(401)
                    expect(await res.json()).to.deep.equal({
                        error: "invalid_request",
                        error_description: "Bad authorization header 'Basic bXktYXB': The decoded header must contain '{client_id}:{client_secret}'"
                    })
                });
    
                it ("can simulate invalid token errors", async () => {

                    const body = new URLSearchParams()
                    body.set("grant_type", "authorization_code")
                    body.set("redirect_uri", "x")
                    body.set("code", jwt.sign({ auth_error:"token_invalid_token", redirect_uri: "x" }, config.jwtSecret))

                    const res = await request(url("/auth/token"), {
                        method: "POST",
                        body,
                        headers: {
                            "content-type" : "application/x-www-form-urlencoded",
                            "Authorization": "Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz"
                        }  
                    })

                    expect(res.status).to.equal(401)
                    expect(await res.json()).to.deep.equal({
                        error: "invalid_client",
                        error_description: "Invalid token!"
                    })
                });
            })
        });

        describe('Introspection', function() {

            it ("requires authorization", async () => {
                const res = await request(url("/auth/introspect"), { method: "POST" })
                expect(res.status).to.equal(401)
                expect(res.statusText).to.equal("Unauthorized")
                expect(await res.text()).to.equal("Authorization is required")
            })

            it ("rejects invalid token", async () => {
                const res = await request(url("/auth/introspect"), {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer invalidToken`
                    }
                })
                expect(res.status).to.equal(401)
            })

            it ("requires token in the payload", async () => {
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
                
                const { access_token } = await getAccessToken(code, redirect_uri).then(res => res.json());

                const res = await request(url("/auth/introspect"), {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                expect(res.status).to.equal(400)
                expect(await res.text()).to.equal("No token provided")
            })

            it ("can introspect an access token", async () => {
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
                
                const { access_token } = await getAccessToken(code, redirect_uri).then(res => res.json());

                const payload = new URLSearchParams()
                payload.set("token", access_token)

                const res = await request(url("/auth/introspect"), {
                    method: "POST",
                    body: payload,
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                expect(res.status).to.equal(200)

                const body = await res.json();

                expect(body.active).to.be.true;
                expect(body.exp).to.exist;
                expect(body.scope).to.exist;
                expect(body.patient).to.equal("abc");
                expect(body.client_id).to.equal("example-client");
            })

            it ("can introspect a refresh token", async () => {
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
                
                const { access_token, refresh_token } = await getAccessToken(code, redirect_uri).then(res => res.json());

                const payload = new URLSearchParams()
                payload.set("token", refresh_token)

                const res = await request(url("/auth/introspect"), {
                    method: "POST",
                    body: payload,
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                expect(res.status).to.equal(200)

                const body = await res.json();

                if(body.active !== true) throw new Error("Token is not active.");
            })

            it ("gets active: false for authorized request with invalid token", async () => {
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
                
                const { access_token } = await getAccessToken(code, redirect_uri).then(res => res.json());

                const payload = new URLSearchParams()
                payload.set("token", "invalid token")

                const res = await request(url("/auth/introspect"), {
                    method: "POST",
                    body: payload,
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                expect(res.status).to.equal(200)
                expect(res.headers.get('content-type')).to.match(/json/)

                const body = await res.json();

                expect(body.active).to.equal(false)
                expect(body.error.name).to.equal("JsonWebTokenError")
            })

            it ("gets active: false for authorized request with expired token", async () => {

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
                
                const { access_token } = await getAccessToken(code, redirect_uri).then(res => res.json());

                const payload = new URLSearchParams()
                payload.set("token", expiredToken)

                const res = await request(url("/auth/introspect"), {
                    method: "POST",
                    body: payload,
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                expect(res.status).to.equal(200)
                expect(res.headers.get('content-type')).to.match(/json/)

                const body = await res.json();

                expect(body.active).to.equal(false)
                expect(body.error.name).to.equal("TokenExpiredError")
            })
        })

        describe('Backend Services', () => {

            describe('Client Registration', () => {
        
                it ("requires form-urlencoded POST", async () => {
                    const res = await request(url("/auth/register"), { method: "POST" });
                    expect(res.status).to.equal(400)
                    expect(await res.json()).to.deep.equal({
                        error: "invalid_request",
                        error_description: "Invalid request content-type header (must be 'application/x-www-form-urlencoded')"
                    })
                });
        
                it ("requires 'iss' parameter", async () => {
                    const res = await request(url("/auth/register"), {
                        method: "POST",
                        body: "",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    expect(res.status).to.equal(400)
                    expect(await res.json()).to.deep.equal({
                        error: "invalid_request",
                        error_description: 'Missing parameter "iss"'
                    })
                });
        
                it ("requires 'pub_key' parameter", async () => {
                    const payload = new URLSearchParams()
                    payload.set("iss", "whatever")
                    const res = await request(url("/auth/register"), {
                        method: "POST",
                        body: payload,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    expect(res.status).to.equal(400)
                    expect(await res.json()).to.deep.equal({
                        error: "invalid_request",
                        error_description: 'Missing parameter "pub_key"'
                    })
                });
        
                it ("validates the 'dur' parameter", () => {
                    return Promise.all(
                        ["x", Infinity, -Infinity, -2].map(async dur => {

                            const payload = new URLSearchParams()
                            payload.set("iss", "whatever")
                            payload.set("pub_key", "abc")
                            payload.set("dur", dur + "")

                            const res = await request(url("/auth/register"), {
                                method: "POST",
                                body: payload,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            });
                            expect(res.status).to.equal(400)
                            expect(await res.json()).to.deep.equal({
                                error: "invalid_request",
                                error_description: 'Invalid parameter "dur"'
                            })
                        })
                    )
                });
        
                it ("basic usage", async () => {
                    const payload = new URLSearchParams()
                    payload.set("iss", "whatever")
                    payload.set("pub_key", "something")

                    const res = await request(url("/auth/register"), {
                        method: "POST",
                        body: payload,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });

                    expect(res.status).to.equal(200)
                    expect(res.headers.get("content-type")).to.match(/\btext\/plain\b/i)

                    const txt = await res.text()

                    expect(jwt.decode(txt)).to.not.be.null;
                });
        
                it ("accepts custom duration", async () => {
                    const payload = new URLSearchParams()
                    payload.set("iss", "whatever")
                    payload.set("pub_key", "something")
                    payload.set("dur", "23")

                    const res = await request(url("/auth/register"), {
                        method: "POST",
                        body: payload,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });

                    expect(res.status).to.equal(200)
                    expect(res.headers.get("content-type")).to.match(/\btext\/plain\b/i)

                    const txt = await res.text()

                    // @ts-ignore
                    expect(jwt.decode(txt).accessTokensExpireIn).to.equal(23)
                });
        
                it ("accepts custom simulated errors", async () => {
                    const payload = new URLSearchParams()
                    payload.set("iss", "whatever")
                    payload.set("pub_key", "something")
                    payload.set("auth_error", "test error")

                    const res = await request(url("/auth/register"), {
                        method: "POST",
                        body: payload,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });

                    expect(res.status).to.equal(200)
                    expect(res.headers.get("content-type")).to.match(/\btext\/plain\b/i)

                    const txt = await res.text()

                    // @ts-ignore
                    expect(jwt.decode(txt).auth_error).to.equal("test error")
                });
            });
        
            it ("Authorization Claim works as expected", async () => {
                const iss = "whatever";
                const tokenUrl = url("/auth/token");

                const alg = "RS384"
                const key = await jose.JWK.createKey("RSA", 2048, { alg })

                const payload = new URLSearchParams()
                payload.set("iss", iss)
                payload.set("pub_key", key.toPEM())

                const token = await request(url("/auth/register"), {
                    method: "POST",
                    body: payload,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => res.text());

                let jwtToken = {
                    iss,
                    sub: token,
                    aud: tokenUrl.href,
                    exp: Date.now()/1000 + 300, // 5 min
                    jti: crypto.randomBytes(32).toString("hex")
                };
            
                const payload2 = new URLSearchParams()
                payload2.set("scope", "system/*.*")
                payload2.set("grant_type", "client_credentials")
                payload2.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer")
                payload2.set("client_assertion", jwt.sign(jwtToken, key.toPEM(true), { algorithm: alg }))

                const tokenResponse = await request(tokenUrl, {
                    method: "POST",
                    body: payload2,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => res.json());

                if (tokenResponse.token_type !== "bearer") {
                    throw new Error(`Authorization failed! Expecting token_type: bearer but found ${tokenResponse.token_type}`);
                }
                if (tokenResponse.expires_in !== 900) {
                    throw new Error(`Authorization failed! Expecting expires_in: 900 but found ${tokenResponse.expires_in}`);
                }
                if (!tokenResponse.access_token) {
                    throw new Error(`Authorization failed! No access_token returned`);
                }
                if (tokenResponse.access_token.split(".").length != 3) {
                    throw new Error("Did not return proper access_token");
                }
            });
        });
    })
}


