
var codec = (function() {
    
    var VALUE_TO_CODE = {
        "launch_ehr"       : "a",
        "patient"          : "b",
        "encounter"        : "c",
        "auth_error"       : "d",
        "provider"         : "e",
        "sim_ehr"          : "f",
        "select_encounter" : "g",
        "launch_prov"      : "h",
        "skip_login"       : "i",
        "skip_auth"        : "j",
        "launch_pt"        : "k",
        "launch_cds"       : "l"
    };

    var CODE_TO_VALUE = {
        "a" : "launch_ehr",
        "b" : "patient",
        "c" : "encounter",
        "d" : "auth_error",
        "e" : "provider",
        "f" : "sim_ehr",
        "g" : "select_encounter",
        "h" : "launch_prov",
        "i" : "skip_login",
        "j" : "skip_auth",
        "k" : "launch_pt",
        "l" : "launch_cds"
    };

    var SIM_ERRORS = [
        "auth_invalid_client_id",
        "auth_invalid_redirect_uri",
        "auth_invalid_scope",
        "auth_invalid_client_secret",
        "token_invalid_token",
        "token_expired_refresh_token",
        "request_invalid_token",
        "request_expired_token"
    ];

    var out = {
        
        encode: function(object, strict) {
            var out = {}, code;
            for (var key in object) {
                code = VALUE_TO_CODE[key];
                if (code) {
                    if (key == "auth_error") {
                        out[code] = SIM_ERRORS.indexOf(object[key]);
                    }
                    else {
                        out[code] = object[key];
                    }
                }
                else {
                    if (!strict) {
                        out[key] = object[key];
                    }
                    else {
                        console.log("codec.encode: unknown parameter \"" + key + "\"");
                    }
                }
            }
            return out;
        },

        decode: function(object, strict) {
            var out = {}, key;
            for (var code in object) {
                key = CODE_TO_VALUE[code];
                if (key) {
                    if (key == "auth_error") {
                        out[key] = SIM_ERRORS[object[code]]
                    }
                    else {
                        out[key] = object[code];
                    }
                }
                else {
                    if (!strict) {
                        out[code] = object[code];
                    }
                    else {
                        console.log("codec.decode: unknown parameter \"" + code + "\"");
                    }
                }
            }
            return out;
        }
    };

    if (typeof module == "object") {
        module.exports = out;
    }

    return out;
})();