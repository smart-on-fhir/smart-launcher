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

    describe('scopeToText', function() {
        it ("'profile' -> Your profile information (r)", function() {
            expect(Lib.scopeToText("profile")).to.deep.equal({
                read: "Your profile information",
                write: "",
                access: "",
                other: ""
            });
        });

        it ("Invalid scope ('x') -> none", function() {
            expect(Lib.scopeToText("x")).to.deep.equal({
                read : "",
                write: "",
                access: "",
                other: ""
            });
        });

        it ("'patient/*.read' as practitioner -> All data on the current patient (r)", function() {
            expect(Lib.scopeToText("patient/*.read")).to.deep.equal({
                read: "All data on the current patient",
                write: "",
                access: "",
                other: ""
            });
        });

        it ("'patient/*.read' as patient -> Your medical information (r)", function() {
            expect(
                Lib.scopeToText("patient/*.read", true).read
            ).to.equal("Your medical information");
        });

        it ("'patient/Observation.read' as practitioner -> Observation data on the current patient (r)", function() {
            expect(
                Lib.scopeToText("patient/Observation.read").read
            ).to.equal("Observation data on the current patient");
        });

        it ("'patient/Observation.read' as patient -> Your information of type \"Observation\" (r)", function() {
            expect(
                Lib.scopeToText("patient/Observation.read", true).read
            ).to.equal('Your information of type "Observation"');
        });

        it ("'patient/Observation.*' as practitioner -> Observation data on the current patient (rw)", function() {
            expect(
                Lib.scopeToText("patient/Observation.*")
            ).to.deep.equal({
                read: "Observation data on the current patient",
                write: "Observation data on the current patient",
                access: "",
                other: ""
            });
        });

        it ("'patient/Observation.*' as patient -> Your information of type \"Observation\" (rw)", function() {
            expect(
                Lib.scopeToText("patient/Observation.*", true)
            ).to.deep.equal({
                read: 'Your information of type "Observation"',
                write: 'Your information of type "Observation"',
                access: "",
                other: ""
            });
        });

        it ("'patient/*.*' as practitioner -> All data on the current patient (rw)", function() {
            expect(
                Lib.scopeToText("patient/*.*")
            ).to.deep.equal({
                read: "All data on the current patient",
                write: "All data on the current patient",
                access: "",
                other: ""
            });
        });

        it ("'patient/*.*' as patient -> Your medical information (rw)", function() {
            expect(
                Lib.scopeToText("patient/*.*", true)
            ).to.deep.equal({
                read: 'Your medical information',
                write: 'Your medical information',
                access: "",
                other: ""
            });
        });

        it ("'user/*.read' as practitioner -> All data you have access to in the EHR system (r)", function() {
            expect(
                Lib.scopeToText("user/*.read").read
            ).to.equal("All data you have access to in the EHR system");
        });

        it ("'user/*.read' as patient -> Your medical information (r)", function() {
            expect(
                Lib.scopeToText("user/*.read", true).read
            ).to.equal("Your medical information");
        });

        it ("'user/Observation.read' as practitioner -> Observation data you have access to in the EHR system (r)", function() {
            expect(
                Lib.scopeToText("user/Observation.read").read
            ).to.equal("Observation data you have access to in the EHR system");
        });

        it ("'user/Observation.read' as patient -> Your information of type \"Observation\" (r)", function() {
            expect(
                Lib.scopeToText("user/Observation.read", true).read
            ).to.equal('Your information of type "Observation"');
        });

        it ("'user/Observation.*' as practitioner -> Observation data you have access to in the EHR system (rw)", function() {
            expect(
                Lib.scopeToText("user/Observation.*")
            ).to.deep.equal({
                read: 'Observation data you have access to in the EHR system',
                write: 'Observation data you have access to in the EHR system',
                access: "",
                other: ""
            });
        });

        it ("'user/Observation.*' as patient -> Your information of type \"Observation\" (rw)", function() {
            expect(
                Lib.scopeToText("user/Observation.*", true)
            ).to.deep.equal({
                read : 'Your information of type "Observation"',
                write: 'Your information of type "Observation"',
                access: "",
                other: ""
            });
        });

        it ("'user/*.*' as practitioner -> All data you have access to in the EHR system (rw)", function() {
            expect(
                Lib.scopeToText("user/*.*")
            ).to.deep.equal({
                read : "All data you have access to in the EHR system",
                write: "All data you have access to in the EHR system",
                access: "",
                other: ""
            });
        });

        it ("'user/*.*' as patient -> Your medical information (rw)", function() {
            expect(
                Lib.scopeToText("user/*.*", true)
            ).to.deep.equal({
                read : 'Your medical information',
                write: 'Your medical information',
                access: "",
                other: ""
            });
        });

        it ("'user/patient.read' as practitioner -> Demographic data you have access to in the EHR system (r)", function() {
            expect(
                Lib.scopeToText("user/patient.read")
            ).to.deep.equal({
                read: "Demographic data you have access to in the EHR system",
                write: "",
                access: "",
                other: ""
            });
        });

        it ("'user/patient.read' as patient -> Your information of type \"Demographic\" (r)", function() {
            expect(
                Lib.scopeToText("user/patient.read", true)
            ).to.deep.equal({
                read: 'Your information of type "Demographic"',
                write: "",
                access: "",
                other: ""
            });
        });
    });

    describe("scopeListToPermissions", function() {

        it ("Works with no scopes", function() {
            expect(Lib.scopeListToPermissions("")).to.deep.equal({
                read  : [],
                write : [],
                access: [],
                other : []
            })
        });

        it ("Works with one scope", function() {
            expect(Lib.scopeListToPermissions("profile")).to.deep.equal({
                read  : ["Your profile information"],
                write : [],
                access: [],
                other : []
            })
        });

        it ("Works with multiple scopes", function() {
            expect(Lib.scopeListToPermissions("profile user/*.*", true)).to.deep.equal({
                read  : ["Your profile information", "Your medical information"],
                write : ["Your medical information"],
                access: [],
                other : []
            })
        });
    });
});