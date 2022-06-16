const nock       = require("nock")
const jwt        = require("jsonwebtoken")
const request    = require("supertest")
const { expect } = require("chai")
const config     = require("../src/config")
const app        = require("../src/index.js")
const Lib        = require("../src/lib")

const agent = request(app);

["r2", "r3", "r4"].forEach(FHIR_VERSION => {

    describe(`FHIR Server ${FHIR_VERSION}`, () => {    

        const BASE_URL          = config.baseUrl
        const UPSTREAM_BASE_URL = "http://" + FHIR_VERSION + ".upstream.test:8000"
        const PATH_AUTHORIZE    = `/v/${FHIR_VERSION}/auth/authorize`
        const PATH_TOKEN        = `/v/${FHIR_VERSION}/auth/token`
        const PATH_INTROSPECT   = `/v/${FHIR_VERSION}/auth/introspect`
        const PATH_FHIR         = `/v/${FHIR_VERSION}/fhir`
        const PATH_METADATA     = `/v/${FHIR_VERSION}/fhir/metadata`
        const URI_AUTHORIZE     = `${BASE_URL}${PATH_AUTHORIZE}`
        const URI_TOKEN         = `${BASE_URL}${PATH_TOKEN}`

        describe('Proxy', function() {

            afterEach(() => {
                nock.cleanAll()
                nock.abortPendingRequests()
            });

            it ("Rejects unknown fhir versions", async () => {
                const url = "/v/no-such-fhir-version/fhir/Patient";
                await agent.get(url).expect(400, /FHIR server .+ not found/)
            })

            it ("Validates the FHIR version", async () => {
                await agent.get("/v/r123/fhir/Patient")
                .expect(400, '{"error":"FHIR server r123 not found"}')
                .expect('Content-Type', /json/)
            });

            it ("Handles upstream being down in case of metadata request", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .replyWithError({ code: 503, message: "Service unavailable" });

                await agent.get(PATH_METADATA)
                // .set('Accept', 'text/html')
                // .expect('content-type', /application\/(fhir\+json|json\+fhir|json)/)
                .expect(503, /Service unavailable/)
            })

            it ("Replies with proper content type", async () => {
                // Mock the upstream server to reply with JSON. Then assert
                // that the proxy overrides the content-type to fhir+json,
                // even if the client sends an html accept header
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .reply(200, { x: 1 }, { "content-type": "application/json" });

                await agent.get(PATH_METADATA)
                .set('Accept', 'text/html')
                .expect('content-type', /application\/(fhir\+json|json\+fhir|json)/)
                .expect(200, {"x":1})
            });

            it ("Removes custom headers", async () => {
                
                // Mock the upstream server so that it replies with 200 OK,
                // but also returns some custom response headers which the
                // proxy should strip
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .reply(200, {}, { 'x-custom': "whatever" });

                await agent.get(`${PATH_FHIR}/Patient`).expect(
                    res => expect(res.header['x-custom']).to.equal(undefined)
                )
            });

            it ("Validates the auth token if one is sent", async () => {
                await agent.get(`${PATH_FHIR}/Patient`)
                .set("authorization", "Bearer whatever")
                .expect('Content-Type', /text/)
                .expect(/Invalid token\: /)
                .expect(401)
            });
            
            it ("Adjust urls in the fhir response", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .reply(200, {
                        a: UPSTREAM_BASE_URL,
                        b: UPSTREAM_BASE_URL + "/xyz"
                    }, {
                        "content-type": "application/json"
                    });

                await agent.get(`${PATH_FHIR}/Patient`)
                .expect(res => {
                    if (res.text.indexOf(UPSTREAM_BASE_URL) > -1) {
                        console.log(res.text)
                        throw new Error("Not all URLs replaced");
                    }
                })
            });

            it ("Adjust urls in the fhir response of the CapabilityStatement", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .reply(200, {
                        a: UPSTREAM_BASE_URL,
                        b: UPSTREAM_BASE_URL + "/xyz"
                    }, {
                        "content-type": "application/json"
                    });

                await agent.get(`${PATH_FHIR}/metadata`)
                .expect(res => {
                    if (res.text.indexOf(UPSTREAM_BASE_URL) > -1) {
                        console.log(res.text)
                        throw new Error("Not all URLs replaced");
                    }
                })
            });

            it ("Handles pagination", async () => {

                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .replyWithFile(200, "./test/mocks/PatientBundlePage1.json", { "content-type": "application/json" });

                await agent.get(`${PATH_FHIR}/Patient`).expect(async (res) => {
                    if (!Array.isArray(res.body.link)) {
                        throw new Error("No links found");
                    }

                    let next = res.body.link.find(l => l.relation == "next")
                    if (!next) {
                        throw new Error("No next link found");
                    }
                    
                    const nextURL = new URL(next.url)

                    nock(UPSTREAM_BASE_URL)
                    .get(nextURL.pathname)
                    .replyWithFile(200, "./test/mocks/PatientBundlePage2.json", { "content-type": "application/json" });

                    const res2 = await agent.get(nextURL.pathname + nextURL.search)
                    
                    if (!Array.isArray(res2.body.link)) {
                        throw new Error("No links found on second page");
                    }

                    let self = res2.body.link.find(l => l.relation == "self")

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
                })
            });

            it ("Replies with formatted JSON for bundles", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .reply(200, JSON.stringify({ a: [1] }, null, 4), { "content-type": "application/json" });
                await agent.get(`${PATH_FHIR}/Patient`).expect(/\n.+/);
            });

            it ("Replies with formatted JSON for single resources", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient/1")
                    .reply(200, JSON.stringify({ a: 1 }, null, 4), { "content-type": "application/json" });
                await agent.get(`${PATH_FHIR}/Patient/1`).expect(/\n.+/);
            });

            it ("Passes through the content-type, etag and location response headers", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .reply(200, "", {
                        "content-type": "application/test-custom-type",
                        "etag"        : "test-custom-etag",
                        "location"    : "test-custom-location"
                    });
                await agent.get(`${PATH_FHIR}/Patient`)
                    .expect("content-type", "application/test-custom-type")
                    .expect("etag"        , "test-custom-etag")
                    .expect("location"    , "test-custom-location");
            })

            it ('Injects the SMART information in metadata responses', async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .replyWithFile(200, "./test/mocks/CapabilityStatement.json", { "content-type": "application/json" });
            
                await agent.get(PATH_METADATA)
                .expect('content-type', /\bjson\b/i)
                .expect(200)
                .expect(res => {
                    let uris = Lib.getPath(res.body, "rest.0.security.extension.0.extension");
                    
                    // authorize -----------------------------------------------
                    let authorizeCfg = uris.find(o => o.url == "authorize");
                    if (!authorizeCfg) {
                        throw new Error("No 'authorize' endpoint found in the conformance statement");
                    }
                    if (authorizeCfg.valueUri != URI_AUTHORIZE) {
                        throw new Error("Wrong 'authorize' endpoint found in the conformance statement");
                    }

                    // token ---------------------------------------------------
                    let tokenCfg = uris.find(o => o.url == "token");
                    if (!tokenCfg) {
                        throw new Error("No 'token' endpoint found in the conformance statement");
                    }
                    if (tokenCfg.valueUri != URI_TOKEN) {
                        throw new Error("Wrong 'token' endpoint found in the conformance statement");
                    }
                });
            });

            it ("includes the introspect endpoint in the CapabilityStatement", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .replyWithFile(200, "./test/mocks/CapabilityStatement.json", { "content-type": "application/json" });
                
                await agent.get(PATH_METADATA).expect(/json/).expect(200).then(response => {
                    const oauthUris = response.body.rest[0].security.extension.find(e => /StructureDefinition\/oauth-uris$/.test(e.url));
                    expect(oauthUris);
                    const introspection = oauthUris.extension.find(e => e.url === "introspect");
                    expect(introspection);
                    expect(new URL(introspection.valueUri).pathname).equal(PATH_INTROSPECT);
                })
            })

            it ("Can simulate custom token errors", async () => {
                const token = jwt.sign({ sim_error: "test error" }, config.jwtSecret)
                await agent.get(`${PATH_FHIR}/Patient`)
                .set("authorization", "bearer " + token)
                .expect(401, "test error");
            });
        });
    });
});
