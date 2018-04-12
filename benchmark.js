const Lib = require("./src/lib");
require("colors");

const BASELINES = {
    "Lib.buildUrlPath"        : 0.00158,
    "Lib.normalizeUrl"        : 0.00009,
    "Lib.adjustRequestBody"   : 0.00088,
    "Lib.adjustUrl"           : 0.00112,
    "Lib.addAuthToConformance": 0.00469,
    "Lib.unBundleResource"    : 0.00098,
    "Lib.adjustResponseUrls"  : 0.00296
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
console.log(("📂  Lib".bold + "\n".padEnd(52, "–")).gray);
test("Lib.buildUrlPath", Lib.buildUrlPath, "/abxc/", "/asdb/")
test("Lib.normalizeUrl", Lib.normalizeUrl, "dasdasasda/sda/sd/asd/asdasdas")
test("Lib.adjustRequestBody", Lib.adjustRequestBody, { resource: {} }, "system", ["sb1", "sb2"])
test("Lib.adjustUrl", Lib.adjustUrl, "a/b/c/?f=5", true, ["sb1", "sb2"])
test("Lib.addAuthToConformance", Lib.addAuthToConformance, {rest: {}}, "authBaseUrl")
test("Lib.unBundleResource", Lib.unBundleResource, '{"entry":[{"resource":1}]}');
test(
    "Lib.adjustResponseUrls",
    Lib.adjustResponseUrls,
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
