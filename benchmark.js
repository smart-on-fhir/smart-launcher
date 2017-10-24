const sanboxify = require("./src/sandboxify");
const Lib       = require("./src/lib");
require("colors");

const BASELINES = {
    "sanboxify.buildUrlPath"        : 0.00158,
    "sanboxify.normalizeUrl"        : 0.00009,
    "sanboxify.adjustRequestBody"   : 0.00088,
    "sanboxify.adjustUrl"           : 0.00112,
    "sanboxify.addAuthToConformance": 0.00469,
    "sanboxify.unbundleResource"    : 0.00098,
    "sanboxify.adjustResponseUrls"  : 0.00296
};

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
}

function test(label, fn, ...args) {
    let n = 100000;
    let precision = 3;
    let mul = Math.pow(10, precision);
    let i = n;
    let start = Date.now();
    while (--i) {
        fn(...args);
    }

    let time = Math.round(((Date.now() - start) / n) * mul) / mul;
    let msg = label.split(".").pop().bold.white + " "
    msg = (msg.padEnd(50, "…") + " " + time.toFixed(precision).bold + " ms").grey;
    if (label in BASELINES) {
        let diff = Math.round((time - BASELINES[label]) * mul) / mul;
        msg += (" (" + (diff < 0 ? diff : "+" + diff) + "ms)")[
            diff > 0 ? "red" : diff < 0 ? "green" : "blue"
        ]
    }
    console.log(msg);
}

console.log("\n");

// Sanboxify -------------------------------------------------------------------
console.log(("📂  Sanboxify".bold + "\n".padEnd(52, "–")).gray);
test("sanboxify.buildUrlPath", sanboxify.buildUrlPath, "/abxc/", "/asdb/")
test("sanboxify.normalizeUrl", sanboxify.normalizeUrl, "dasdasasda/sda/sd/asd/asdasdas")
test("sanboxify.adjustRequestBody", sanboxify.adjustRequestBody, { resource: {} }, "system", ["sb1", "sb2"])
test("sanboxify.adjustUrl", sanboxify.adjustUrl, "a/b/c/?f=5", true, ["sb1", "sb2"])
test("sanboxify.addAuthToConformance", sanboxify.addAuthToConformance, {rest: {}}, "authBaseUrl")
test("sanboxify.unbundleResource", sanboxify.unbundleResource, '{"entry":[{"resource":1}]}');
test(
    "sanboxify.adjustResponseUrls",
    sanboxify.adjustResponseUrls,
    "This is a test", // bodyText
    "a", // fhirUrl
    "s", // requestUrl
    "d", // fhirBaseUrl
    "f"  // requestBaseUrl
);

// Lib -------------------------------------------------------------------------
// test("Lib.getPath", Lib.getPath);
// test("Lib.generateRefreshToken", Lib.generateRefreshToken);
// test("Lib.printf", Lib.printf);
// test("Lib.redirectWithError", Lib.redirectWithError);
// test("Lib.replyWithError", Lib.replyWithError);
// test("Lib.getErrorText", Lib.getErrorText);
// test("Lib.getFirstMissingProperty", Lib.getFirstMissingProperty);
// test("Lib.htmlEncode", Lib.htmlEncode);

console.log("\n");
