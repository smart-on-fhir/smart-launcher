var expect = chai.expect;

describe('Lib', function() {
    describe('toCamelCase', function() {
        it('dashes, lower-camel-case', function() {
            expect(Lib.toCamelCase("a-bc-de")).to.equal("aBcDe");
        });
        it('dashes, upper-camel-case', function() {
            expect(Lib.toCamelCase("ab-bc-de", true)).to.equal("AbBcDe");
        });
        it('underscores, lower-camel-case', function() {
            expect(Lib.toCamelCase("a_bc_de")).to.equal("aBcDe");
        });
        it('underscores, upper-camel-case', function() {
            expect(Lib.toCamelCase("ab_bc_de", true)).to.equal("AbBcDe");
        });
    });

    describe('getUrlQuery', function() {
        it('simple case', function() {
            expect(Lib.getUrlQuery({ queryString: "?a=b&c=d" })).to.deep.equal({
                a: "b",
                c: "d"
            });
        });

        it('Without "?" in front', function() {
            expect(Lib.getUrlQuery({ queryString: "a=b&c=d" })).to.deep.equal({
                a: "b",
                c: "d"
            });
        });

        it('Array params', function() {
            expect(Lib.getUrlQuery({ queryString: "a=b&c=d&c=e" })).to.deep.equal({
                a: "b",
                c: ["d", "e"]
            });
        });
    });
});