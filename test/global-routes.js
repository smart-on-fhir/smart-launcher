const { expect } = require("chai")
const { BASE_URL } = require("./testSetup")


it ('index responds with html', async () => {
    const res = await fetch(BASE_URL + '/')
    expect(res.headers.get('Content-Type')).to.match(/html/);
});

it ('/keys hosts the public keys', async () => {
    const res = await fetch(BASE_URL + '/keys')
    expect(res.headers.get('Content-Type')).to.match(/json/)
    expect(res.status).to.equal(200)
    const body = await res.json()
    expect(body).to.have.property("keys")
    expect(body.keys).to.be.an("Array")
    expect(body.keys).to.haveOwnProperty("length").greaterThan(0)
});

it ('/public_key hosts the public key as pem', async() => {
    const res = await fetch(BASE_URL + '/public_key')
    expect(res.headers.get('Content-Type')).to.match(/text/)
    expect(res.status).to.equal(200)
    const body = await res.text()
    expect(body).to.match(/-----BEGIN PUBLIC KEY-----/)
});

it ("/env.js", async () => {
    const res = await fetch(BASE_URL + '/env.js')
    expect(res.headers.get('Content-Type')).to.match(/javascript/)
    expect(res.status).to.equal(200)
    const body = await res.text()
    expect(body).to.match(/var ENV = \{/)
})

it ("rejects xml", async () => {
    const res = await fetch(BASE_URL + "/", {
        headers: {
            "content-type": "application/xml"
        }
    })
    expect(res.status).to.equal(400)
    const body = await res.text()
    expect(body).to.match(/XML format is not supported/)
})

describe("/launcher", () => {
    it ("requires launch_uri", async () => {
        const res = await fetch(BASE_URL + '/launcher')
        expect(res.status).to.equal(400)
        const body = await res.text()
        expect(body).to.equal("launch_uri is required")
    })

    it ("requires absolute launch_uri", async () => {
        const res = await fetch(BASE_URL + '/launcher?launch_uri=./test')
        expect(res.status).to.equal(400)
        const body = await res.text()
        expect(body).to.equal("Invalid launch_uri parameter")
    })

    it ("validates the fhir_ver param", async () => {
        const res = await fetch(BASE_URL + '/launcher?launch_uri=http://test.dev&fhir_ver=33')
        expect(res.status).to.equal(400)
        const body = await res.text()
        expect(body).to.equal("Invalid or missing fhir_ver parameter. It can only be '2', '3' or '4'.")
    })

    it ("works", async () => {
        const url = new URL(BASE_URL + '/launcher')
        url.searchParams.set("launch_uri", 'http://test.dev/')
        url.searchParams.set("fhir_ver", '3')
        const res = await fetch(url, { redirect: "manual" })
        expect(res.status).to.equal(302)
        expect(res.headers.get("location")).to.match(/^http\:\/\/test\.dev\/\?iss=.+/)
    })
})

describe('RSA Generator', () => {
    
    it ("can generate random strings", async () => {
        const res = await fetch(BASE_URL + '/generator/random')
        expect(res.headers.get('Content-Type')).to.match(/text\/plain/)
        expect(res.status).to.equal(200)
        expect(await res.text()).to.match(/^[0-9a-fA-F]{64}$/);
    });

    it ("can generate random strings with ?enc=hex param", async () => {
        const res = await fetch(BASE_URL + '/generator/random?enc=hex')
        expect(res.headers.get('Content-Type')).to.match(/text\/plain/)
        expect(res.status).to.equal(200)
        expect(await res.text()).to.match(/^[0-9a-fA-F]{64}$/);
    });

    it ("random strings length defaults to 32", async () => {
        const res = await fetch(BASE_URL + '/generator/random?len=-5')
        expect(res.headers.get('Content-Type')).to.match(/text\/plain/)
        expect(res.status).to.equal(200)
        expect(await res.text()).to.match(/^[0-9a-fA-F]{64}$/);
    });

    it ("can generate random RSA-256 key pairs", async () => {
        const res = await fetch(BASE_URL + "/generator/rsa")
        expect(res.status).to.equal(200)
        expect(res.headers.get('Content-Type')).to.match(/json/)

        let { privateKey, publicKey } = await res.json()
        
        expect(privateKey, "The generator did not create a private key")
        expect(publicKey, "The generator did not create a public key")

        // Make another request to verify that generated keys are NOT the same
        // as those from the last request 
        const res2 = await fetch(BASE_URL + "/generator/rsa")
        expect(res2.status).to.equal(200)
        expect(res2.headers.get('Content-Type')).to.match(/json/)

        let { privateKey: privateKey2, publicKey: publicKey2 } = await res2.json()

        expect(privateKey2, "The generator did not create a private key").to.exist
        expect(publicKey2, "The generator did not create a public key").to.exist
        expect(privateKey2).to.not.equal(privateKey, "privateKey does not change between requests")
        expect(publicKey2).to.not.equal(publicKey, "publicKey does not change between requests")
    });
});


