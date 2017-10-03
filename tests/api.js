const request = require('supertest');
const app     = require("../src/index.js");
const config  = require("../src/config");
const jwt     = require("jsonwebtoken");

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
        it(path + ' responds with json+fhir', done => {
            request(app)
            .get(path)
            // .set('Accept', 'application/json')
            .expect('Content-Type', /^application\/json\+fhir/)
            .expect(200, done);
        });
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
    buildRoutePermutations("authorize").forEach(path => {
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
                    query.push(name + "=x");
                    done();
                });
            });
        });
    });

    {
        let sim = new Buffer('{"auth_error":"auth_invalid_redirect_uri"}').toString('base64');
        let paths = buildRoutePermutations("auth/authorize?launch=" + sim + "&response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&aud=x");
        paths.push(`/v/r3/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&aud=x"`);
        paths.forEach(path => {
            it (path.split("?")[0] + " can simulate invalid redirect_uri error", done => {
                request(app)
                .get(path)
                .expect(400)
                .expect("Invalid redirect_uri parameter")
                .end(done);
            });
        });
    }
    {
        let sim = new Buffer('{"auth_error":"auth_invalid_scope"}').toString('base64');
        let paths = buildRoutePermutations("auth/authorize?launch=" + sim + "&response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&aud=x");
        paths.push(`/v/r3/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&aud=x"`);
        paths.forEach(path => {
            it (path.split("?")[0] + " can simulate invalid scope error", done => {
                request(app)
                .get(path)
                .expect(400)
                .expect("Invalid scope parameter")
                .end(done);
            });
        });
    }
    {
        let sim = new Buffer('{"auth_error":"auth_invalid_client_id"}').toString('base64');
        let paths = buildRoutePermutations("auth/authorize?launch=" + sim + "&response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&aud=x");
        paths.push(`/v/r3/sim/${sim}/auth/authorize?response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&aud=x"`);
        paths.forEach(path => {
            it (path.split("?")[0] + " can simulate invalid client_id error", done => {
                request(app)
                .get(path)
                .expect(400)
                .expect("Invalid client_id parameter")
                .end(done);
            });
        });
    }

    buildRoutePermutations(
        "auth/authorize?response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&launch=0&aud=whatever" +
        encodeURIComponent(config.fhirServerR2),
        2
    ).forEach(path => {
        it (path.split("?")[0] + " rejects invalid audience value", done => {
            request(app)
            .get(path)
            .expect(400)
            .expect("Bad audience value")
            .end(done);
        });
    });

    // buildRoutePermutations(
    //     "auth/authorize?response_type=x&client_id=x&redirect_uri=x&scope=x&state=x&launch=0&aud=",
    //     2
    // ).forEach(path => {
    //     let aud = encodeURIComponent(config.baseUrl + path.split("auth/authorize")[0] + "fhir");
    //     it (path.split("?")[0] + " accepts valid audience value", done => {
    //         request(app).get(path + aud).expect(200).end(done);
    //     });
    // });

});
