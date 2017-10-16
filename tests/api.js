const request = require('supertest');
const app     = require("../src/index.js");
const config  = require("../src/config");
const jwt     = require("jsonwebtoken");
const Url     = require("url");

function buildRoutePermutations(suffix = "", fhirVersion) {
    suffix = suffix.replace(/^\//, "");
    let out = [];
    
    if (!fhirVersion || fhirVersion == 3) {
        out.push(
            `/v/r3/sb/abc/sim/whatever/${suffix}`, 
            `/v/r3/sb/abc/${suffix}`,
            `/v/r3/sim/whatever/${suffix}`,
            `/v/r3/${suffix}`
        );
    }

    if (!fhirVersion || fhirVersion == 2) {
        out.push(
            `/v/r2/sb/abc/sim/whatever/${suffix}`, 
            `/v/r2/sb/abc/${suffix}`,
            `/v/r2/sim/whatever/${suffix}`,
            `/v/r2/${suffix}`
        );    
    }

    return out;
}

function testAuthAuthorize(params) {
    var defaultParams = {
        "response_type": "code",
        "client_id"    : "my_web_app",
        "redirect_uri" : "https://redirect",
        "scope"        : "patient/*.read launch",
        "state"        : "x",
        "aud"          : "x"
    };
    var paths2 = buildRoutePermutations("auth/authorize", 2);
    var paths3 = buildRoutePermutations("auth/authorize", 3);
}

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
        .get("/v/r3/fhir/metadata")
        .set("authorization", "Bearer whatever")
        .expect('Content-Type', /text/)
        .expect("Invalid token")
        .expect(401, done);
    });

    it ("Can simulate custom token errors");
    it ("Keeps protected data-sets read-only");
    it ("Inject sandbox tag into POST and PUT requests");
    it ("Make urls conditional and if exists, change /id to ?_id=");
    it ("Apply patient scope to GET requests");

    it ("Adjust urls in the fhir response", done => {
        request(app)
        .get("/v/r3/fhir/Patient")
        .expect(res => {
            if (res.text.indexOf(config.fhirServerR3) > -1) {
                throw new Error("Not all URLs replaced");
            }
        })
        .end(done);
    });

    it ("Inject the SMART information in metadata responses");
    it ("pull the resource out of the bundle if we converted a /id url into a ?_id= query");
    it ("Pretty print if called from a browser");

    it ("Replies with application/fhir+json for STU3", done => {
        request(app)
        .get("/v/r3/fhir/Patient")
        .expect("content-Type", /^application\/fhir\+json/i)
        .end(done);
    });

    it ("Replies with application/json+fhir for DSTU2", done => {
        request(app)
        .get("/v/r2/fhir/Patient")
        .expect("content-Type", /^application\/json\+fhir/i)
        .expect(/\n.+/, done);
    });

    it ("Replies with formatted JSON for bundles", done => {
        request(app).get("/v/r3/fhir/Patient").expect(/\n.+/, done);
    });

    it ("Replies with formatted JSON for single resources", done => {
        request(app).get("/v/r3/fhir/Observation/smart-5328-height").expect(/\n.+/, done);
    });

    it ("Handles pagination", done => {
        request(app)
        .get("/v/r3/fhir/Patient")
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
        paths.push(`/v/r3/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x"`);
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
        paths.push(`/v/r3/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x"`);
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
        paths.push(`/v/r3/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=http%3A%2F%2Fx&scope=x&state=x&aud=x"`);
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

});
