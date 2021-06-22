"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var got = require("got");
function humanName(human, separator) {
    if (separator === void 0) { separator = " "; }
    var name = human.name || [];
    if (!Array.isArray(name)) {
        name = [name];
    }
    name = name[0];
    if (!name)
        name = { family: ["No Name Listed"] };
    var out = ["prefix", "given", "family"].map(function (type) {
        if (!name[type]) {
            name[type] = [""];
        }
        if (!Array.isArray(name[type])) {
            name[type] = [name[type]];
        }
        return name[type].join(" ");
    });
    var result = out.filter(Boolean).join(separator);
    if (name.suffix) {
        result += ", " + name.suffix;
    }
    return result;
}
function loginAsProvider(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var templateData, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    templateData = {
                        title: "Provider Login",
                        query: req.query,
                        providers: []
                    };
                    _a = templateData;
                    return [4 /*yield*/, got("http://r4.smarthealthit.org/Practitioner?_summary=true&_count=10&_sort=given", { json: true })];
                case 1:
                    _a.providers = (_b.sent())
                        .body.entry.map(function (e) { return ({ id: e.resource.id, name: humanName(e.resource) }); });
                    res.render("login-as-provider", templateData);
                    return [2 /*return*/];
            }
        });
    });
}
exports.loginAsProvider = loginAsProvider;
function loginAsPatient(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, patient, templateData, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.query.patient, patient = _a === void 0 ? "" : _a;
                    templateData = {
                        title: "Patient Login",
                        patients: patient.trim().split(/\s*,\s*/).filter(Boolean).map(function (p) { return ({ id: p, name: "Pre-selected Patient" }); }),
                        humanName: humanName,
                        query: req.query
                    };
                    if (!!templateData.patients.length) return [3 /*break*/, 2];
                    _b = templateData;
                    return [4 /*yield*/, got("http://r4.smarthealthit.org/Patient?_summary=true&_count=10&_sort=given", { json: true })];
                case 1:
                    _b.patients = (_c.sent())
                        .body.entry.map(function (e) { return ({ id: e.resource.id, name: humanName(e.resource) }); });
                    _c.label = 2;
                case 2:
                    res.render("login-as-patient", templateData);
                    return [2 /*return*/];
            }
        });
    });
}
exports.loginAsPatient = loginAsPatient;
