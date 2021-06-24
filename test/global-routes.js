const request    = require('supertest')
const { expect } = require("chai")
const app        = require("../src/index.js")
const agent      = request(app);


it('index responds with html', () => {
    return agent.get('/').expect('Content-Type', /html/).expect(200);
});

it('/keys hosts the public keys', () => {
    return agent.get('/keys')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect(res => {
        expect(res.body).to.have.property("keys")
        expect(Array.isArray(res.body.keys)).to.be.true
        expect(res.body.keys.length).to.be.greaterThan(0)
    });
});

it('/public_key hosts the public key as pem', () => {
    return agent.get('/public_key')
    .expect('Content-Type', /text/)
    .expect(200)
    .expect(/-----BEGIN PUBLIC KEY-----/)
});

it ("/env.js", () => {
    return agent.get('/env.js')
    .expect('Content-Type', /javascript/)
    .expect(200)
    .expect(/var ENV = \{/)
})

it("rejects xml", async () => {
    await agent.get("/")
    .set("content-type", "application/xml")
    .expect(400, /XML format is not supported/)
})

describe("/launcher", () => {
    it("requires launch_uri", async () => {
        await agent.get('/launcher')
        .expect('Content-Type', /text/)
        .expect(400, "launch_uri is required")
    })

    it("requires absolute launch_uri", async () => {
        await agent.get('/launcher')
        .query({ launch_uri: "./test" })
        .expect('Content-Type', /text/)
        .expect(400, "Invalid launch_uri parameter")
    })

    it("validates the fhir_ver param", async () => {
        await agent.get('/launcher')
        .query({ launch_uri: "http://test.dev", fhir_ver: 33 })
        .expect('Content-Type', /text/)
        .expect(400, "Invalid or missing fhir_ver parameter. It can only be '2', '3' or '4'.")
    })

    it("works", async () => {
        await agent.get('/launcher')
        .query({ launch_uri: "http://test.dev", fhir_ver: 3 })
        .expect("location", /^http\:\/\/test\.dev\?iss=.+/)
        .expect(302)
    })
})

describe('RSA Generator', () => {
    
    it ("can generate random strings", async () => {
        await agent.get('/generator/random')
        .expect('Content-Type', /text\/plain/)
        .expect(200, /^[0-9a-fA-F]{64}$/);

        await agent.get('/generator/random?enc=hex')
        .expect('Content-Type', /text\/plain/)
        .expect(200, /^[0-9a-fA-F]{64}$/);
    });

    it ("random strings length defaults to 32", async () => {
        await agent.get('/generator/random?len=-5')
        .expect('Content-Type', /text\/plain/)
        .expect(200, /^[0-9a-fA-F]{64}$/);
    });

    it ("can generate random RSA-256 key pairs", async () => {
        let { privateKey, publicKey } = await agent.get("/generator/rsa")
        .expect('content-type', /json/)
        .expect(200)
        .then(res => res.body)

        expect(privateKey, "The generator did not create a private key")
        expect(publicKey, "The generator did not create a public key")

        await agent.get("/generator/rsa")
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


