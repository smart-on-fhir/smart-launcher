// const request    = require('supertest');
// const jwt        = require("jsonwebtoken");
// const Url        = require("url");
// const jwkToPem   = require("jwk-to-pem");
// const crypto     = require("crypto");
const { expect } = require("chai");
// const app        = require("../src/index.js");
// const config     = require("../src/config");
// const Codec      = require("../static/codec.js");
const Lib        = require("../src/lib");



it('whitelist throws if no match and no default value', () => {
    expect(() => Lib.whitelist([1,2,3], 4)).to.throw(
        'The value "4" is not allowed. Must be one of 1, 2, 3.'
    )
})

it('whitelist returns the default value if no match', () => {
    expect(Lib.whitelist([1,2,3], 4, 5)).to.equal(5)
})

it('whitelist returns the value if match', () => {
    expect(Lib.whitelist([1,2,3], 2)).to.equal(2)
})

it('assert formats messages', () => {
    expect(() => Lib.assert(false, "a %s b %d c", 2, 3)).to.throw(/a 2 b 3 c/)
})

it('assert formats messages via function', () => {
    expect(() => Lib.assert(() => { throw new Error("test-error") }, "a %s b")).to.throw(/a test-error b/)
})

it('assert.http works via function', () => {
    expect(() => Lib.assert.http(() => { throw new Error("test-error") }, 403, "a %s b")).to.throw(Lib.HTTPError, "test-error")
})

it ('assert.fail works with Error', () => {
    expect(() => Lib.assert.fail(new Error("test-error"))).to.throw("test-error")
})

it ('assert.fail works with HTTPError', () => {
    expect(() => Lib.assert.fail(new Lib.HTTPError(405, "test-error"))).to.throw(Lib.HTTPError, "test-error")
})

it ('assert.fail works with OperationOutcome', () => {
    expect(() => Lib.assert.fail({ type: "OperationOutcome", code: 404, msg: "test-error", error: "test" })).to.throw(/test-error/)
})

it ('assert.fail throws HTTPError by default', () => {
    expect(() => Lib.assert.fail({ code: 404, msg: "test-error", error: "test" })).to.throw(Lib.HTTPError, "test-error")
})

