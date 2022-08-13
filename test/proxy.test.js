const nock         = require("nock")
const jwt          = require("jsonwebtoken")
const { expect }   = require("chai")
const config       = require("../src/config")
const Lib          = require("../src/lib")
const { BASE_URL } = require("./testSetup")


;["r2", "r3", "r4"].forEach(FHIR_VERSION => {

    describe(`FHIR Server ${FHIR_VERSION}`, () => {    

        const UPSTREAM_BASE_URL = "http://" + FHIR_VERSION + ".upstream.test:8000"
        const PATH_AUTHORIZE    = `/v/${FHIR_VERSION}/auth/authorize`
        const PATH_TOKEN        = `/v/${FHIR_VERSION}/auth/token`
        const PATH_INTROSPECT   = `/v/${FHIR_VERSION}/auth/introspect`
        const PATH_FHIR         = `${BASE_URL}/v/${FHIR_VERSION}/fhir`
        const PATH_METADATA     = `${BASE_URL}/v/${FHIR_VERSION}/fhir/metadata`

        describe('Proxy', function() {

            afterEach(() => {
                nock.cleanAll()
                nock.abortPendingRequests()
            });

            it ("Rejects unknown fhir versions", async () => {
                const url = BASE_URL + "/v/no-such-fhir-version/fhir/Patient";
                const res = await fetch(url)
                expect(res.status).to.equal(400)
                expect(await res.text()).to.match(/FHIR server .+ not found/)
            })

            it ("Validates the FHIR version", async () => {
                const res = await fetch(BASE_URL + "/v/r123/fhir/Patient")
                expect(res.status).to.equal(400)
                expect(res.headers.get('Content-Type')).to.match(/\bjson\b/)
                expect(await res.json()).to.deep.equal({"error":"FHIR server r123 not found"})
            });

            it ("Handles upstream being down in case of metadata request", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .replyWithError({ code: 503, message: "Service unavailable" });

                const res = await fetch(PATH_METADATA)
                expect(res.status).to.equal(503)
                expect(await res.text()).to.match(/Service unavailable/)
            })

            it ("Replies with proper content type", async () => {
                // Mock the upstream server to reply with JSON. Then assert
                // that the proxy overrides the content-type to fhir+json,
                // even if the client sends an html accept header
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .reply(200, { x: 1 }, { "content-type": "application/json" });

                const res = await fetch(PATH_METADATA, {
                    headers: {
                        accept: 'text/html' 
                    }
                })

                expect(res.status).to.equal(200)
                expect(res.headers.get('Content-Type')).to.match(/application\/(fhir\+json|json\+fhir|json)/)
                expect(await res.json()).to.deep.equal({ "x": 1 })
            });

            it ("Removes custom headers", async () => {
                
                // Mock the upstream server so that it replies with 200 OK,
                // but also returns some custom response headers which the
                // proxy should strip
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .reply(200, {}, { 'x-custom': "whatever" });

                const res = await fetch(`${PATH_FHIR}/Patient`)
                expect(res.headers.get('x-custom')).to.not.exist
            });

            it ("Validates the auth token if one is sent", async () => {
                const res = await fetch(`${PATH_FHIR}/Patient`, {
                    headers: {
                        authorization: "Bearer whatever"
                    }
                });
                
                expect(res.status).to.equal(401)
                expect(res.headers.get('Content-Type')).to.match(/text/)
                expect(await res.text()).to.match(/Invalid token\: /)
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

                const text = await fetch(`${PATH_FHIR}/Patient`).then(r => r.text())
                expect(text.indexOf(UPSTREAM_BASE_URL)).to.equal(-1, "Not all URLs replaced");
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

                const text = await fetch(`${PATH_FHIR}/metadata`).then(r => r.text())
                expect(text.indexOf(UPSTREAM_BASE_URL)).to.equal(-1, "Not all URLs replaced");
            });

            it ("Handles pagination", async () => {

                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .replyWithFile(200, "./test/mocks/PatientBundlePage1.json", { "content-type": "application/json" });

                
                const body = await fetch(`${PATH_FHIR}/Patient`).then(r => r.json())
                    
                expect(body.link).to.be.an("Array", "No links found");

                let next = body.link.find(l => l.relation == "next")
                expect(next, "No next link found").to.exist;
                
                const nextURL = new URL(next.url)
                nextURL.host = FHIR_VERSION + ".upstream.test:8000"

                nock(UPSTREAM_BASE_URL)
                    .get(nextURL.pathname + nextURL.search)
                    .replyWithFile(200, "./test/mocks/PatientBundlePage2.json", { "content-type": "application/json" });

                const body2 = await fetch(PATH_FHIR + nextURL.pathname + nextURL.search).then(r => r.json())

                expect(body2.link).to.be.an("Array", "No links found on second page");
                if (!Array.isArray(body2.link)) {
                    throw new Error("No links found on second page");
                }

                let self = body2.link.find(l => l.relation == "self")

                if (!self) {
                    throw new Error("No self link found on second page");
                }
                
                if (self.url !== next.url) {
                    throw new Error("Links mismatch");
                }

                let next2 = body2.link.find(l => l.relation == "next")

                if (!next2) {
                    throw new Error("No next link found on second page");
                }
            });

            it ("Replies with formatted JSON for bundles", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .reply(200, JSON.stringify({ a: [1] }, null, 4), { "content-type": "application/json" });
                const txt = await fetch(`${PATH_FHIR}/Patient`).then(r => r.text());
                expect(txt).to.match(/\n.+/);
            });

            it ("Replies with formatted JSON for single resources", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient/1")
                    .reply(200, JSON.stringify({ a: 1 }, null, 4), { "content-type": "application/json" });
                const txt = await fetch(`${PATH_FHIR}/Patient/1`).then(r => r.text());
                expect(txt).to.match(/\n.+/);
            });

            it ("Passes through the content-type, etag and location response headers", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/Patient")
                    .reply(200, "", {
                        "content-type": "application/test-custom-type",
                        "etag"        : "test-custom-etag",
                        "location"    : "test-custom-location"
                    });
                const res = await fetch(`${PATH_FHIR}/Patient`);
                expect(res.headers.get("content-type")).to.equal("application/test-custom-type")
                expect(res.headers.get("etag")).to.equal("test-custom-etag")
                expect(res.headers.get("location")).to.equal("test-custom-location")
            })

            it ('Injects the SMART information in metadata responses', async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .replyWithFile(200, "./test/mocks/CapabilityStatement.json", { "content-type": "application/json" });
            
                const res = await fetch(PATH_METADATA)
                expect(res.status).to.equal(200)
                expect(res.headers.get("content-type")).to.match(/\bjson\b/i)
                const body = await res.json()

                let uris = Lib.getPath(body, "rest.0.security.extension.0.extension");
                
                // authorize ---------------------------------------------------
                let authorizeCfg = uris.find(o => o.url == "authorize");
                if (!authorizeCfg) {
                    throw new Error("No 'authorize' endpoint found in the conformance statement");
                }
                if (authorizeCfg.valueUri != `${config.baseUrl}${PATH_AUTHORIZE}`) {
                    throw new Error("Wrong 'authorize' endpoint found in the conformance statement");
                }

                // token -------------------------------------------------------
                let tokenCfg = uris.find(o => o.url == "token");
                if (!tokenCfg) {
                    throw new Error("No 'token' endpoint found in the conformance statement");
                }
                if (tokenCfg.valueUri != `${config.baseUrl}${PATH_TOKEN}`) {
                    throw new Error("Wrong 'token' endpoint found in the conformance statement");
                }
            });

            it ("includes the introspect endpoint in the CapabilityStatement", async () => {
                nock(UPSTREAM_BASE_URL)
                    .get("/metadata")
                    .replyWithFile(200, "./test/mocks/CapabilityStatement.json", { "content-type": "application/json" });
                
                const res = await fetch(PATH_METADATA)
                expect(res.status).to.equal(200)
                expect(res.headers.get("content-type")).to.match(/\bjson\b/)
                const body = await res.json()
                const oauthUris = body.rest[0].security.extension.find(e => /StructureDefinition\/oauth-uris$/.test(e.url));
                expect(oauthUris).to.exist;
                const introspection = oauthUris.extension.find(e => e.url === "introspect");
                expect(introspection).to.exist;
                expect(new URL(introspection.valueUri).pathname).equal(PATH_INTROSPECT);
            })

            it ("Can simulate custom token errors", async () => {
                const token = jwt.sign({ sim_error: "test error" }, config.jwtSecret)
                const res = await fetch(`${PATH_FHIR}/Patient`, {
                    headers: {
                        authorization: "bearer " + token
                    }
                });
                expect(res.status).to.equal(401)
                expect(await res.text()).to.equal("test error");
            });
        });
    });
});
