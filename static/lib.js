// @ts-check
(function($, undefined) {

    var RE_LODASH     = /_/g;
    var RE_DASH       = /-/g;
    var RE_ANY_DASH   = /[_\-]/;
    var RE_TRUE       = /^(1|yes|true|on)$/i;
    var RE_FALSE      = /^(0|no|false|off|null|undefined|NaN|)$/i;
    var RE_YEAR       = /\d{4}$/;
    var RE_MONTH_YEAR = /\d{4}-d{2}$/;

    /**
     * Walks thru an object (ar array) and returns the value found at the
     * provided path. This function is very simple so it intentionally does not
     * support any argument polymorphism, meaning that the path can only be a
     * dot-separated string. If the path is invalid returns undefined.
     * @param {Object} obj The object (or Array) to walk through
     * @param {String} path The path (eg. "a.b.4.c")
     * @returns {*} Whatever is found in the path or undefined
     */
    function getPath(obj, path) {
        return path.split(".").reduce(function(out, key) {
            return out ? out[key] : undefined;
        }, obj);
    }

    /**
     * Parses the current query string and returns a key/value map of all the
     * parameters.
     * @todo: Handle ampersands 
     * @returns {Object}
     */
    function getUrlQuery(options) {
        options = options || {};
        var q = String(options.queryString || window.location.search)
            .replace(/^\?/, "")/*.replace("&amp;", "&")*/.split("&");
        var out = {};
        $.each(q, function(i, param) {
            if (!param) {
                return true; // continue
            }
            var tokens = param.split('=');
            var key    = tokens[0];
            if (options.camelCaseKeys) {
                key = toCamelCase(key);
            }
            if (key in out) {
                if (!Array.isArray(out[key])) {
                    out[key] = [out[key]];
                }
                out[key].push(decodeURIComponent(tokens[1]));
            }
            else {
                out[key] = decodeURIComponent(tokens[1]);
            }
        });
        return out;
    }

    function compileUrlQuery(params) {
        params = params || {};
        var out = [], entry;
        for (var key in params) {
            entry = params[key];
            if (entry === undefined) {
                continue;
            }
            if (Array.isArray(entry)) {
                entry.forEach(function(o) {
                    out.push(key + "=" + encodeURIComponent(o));
                });
            }
            else {
                out.push(key + "=" + encodeURIComponent(entry));
            }
        }
        return out.join("&");
    }

    function qsToForm() {
        var query = getUrlQuery();
        $.each(query, function(key, value) {
            var target = $('[name="' + key + '"], #' + key.replace(RE_LODASH, "-"));
            if (target.is(":checkbox,:radio")) {
                target.prop("checked", RE_TRUE.test(value));
            } else {
                target.val(value);
            }
        });
    }

    function formToQs(qs) {
        qs = qs || {};
        $("input[id],select[id]").each( function() {
            var target = $(this);
            var key = this.id.replace(RE_DASH, "_");
            if (target.is(":checkbox")) {
                qs[key] = target.prop("checked") ? "1" : "0";
            } else if (target.is(":radio")) {
                if(target.prop("checked")) qs[key] = "1";
            } else {
                qs[key] = (target.val() || "");
            }
        });

        var sortedQs = Object.keys(qs)
            .filter(function(key) {
                return qs[key] !== undefined;
            })
            .sort()
            .map(function(key) {
                return key + "=" + encodeURIComponent(qs[key]);
            })
            .join("&");

        var newUrl = location.href.split("?")[0] + "?" + sortedQs;
        if (history && newUrl != location.href) {
            if (typeof history.replaceState == "function") {
                history.replaceState({}, document.title, newUrl);
            } else {
                location.replace(newUrl);
            }
        }
    }

    function bool(x) {
        return !RE_FALSE.test(String(x).trim());
    }

    /**
     * Converts the input string to camelCase. Detects "-" and "_", removes them
     * and converts the following character to upper case. By default this
     * function produces lowerCamelCase (the first letter is in lower case).
     * You can pass true as second argument to make it return UpperCamelCase.
     * @param {String} str Thew string to convert
     * @param {Boolean} [upper]
     * @returns {String}
     */
    function toCamelCase(str, upper) {
        return (str.toLowerCase().split(RE_ANY_DASH).map(function(seg, i) {
            return (!upper && i === 0 ? seg[0] : seg[0].toUpperCase()) + seg.slice(1);
        })).join("");
    }

    // this is temporary - should use a better algorithm to prevent conflicts
    function generateUID() {
        var firstPart  = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        return  ("000" + firstPart .toString(36)).slice(-3) +
                ("000" + secondPart.toString(36)).slice(-3);
    }

    /**
     * Opens the patient browser in popup window to select some patients
     * @param {String} selection (optional) Comma-separated list of patient IDs
     *                           to be pre-selected. This is a way to pass the
     *                           current selection (if any) that the host app
     *                           maintains. The user will see these IDs as selected
     *                           and will be able to make changes to the selection.
     * @return {Promise<String>} Returns a promise that will eventually be resolved
     *                           with the new selection.
     */
    function selectPatients(selection, options) {
        var dfd = new $.Deferred();
        var cfg = $.extend({
            // The origin of the patient browser app
            origin: "https://patient-browser.smarthealthit.org",
            // What config file to load
            // config: "stu3-open-sandbox",
            // Popup height    
            height: 700,
            // Popup width
            width: 1000
        }, options);

        var path = cfg.origin + "/index.html?_=" + Date.now();
        if (selection) {
            // path += "&config=" + cfg.config;
            path += "#/?_selection=" + encodeURIComponent(selection);
        }

        var tags = getPath(cfg, "pickerSettings.server.tags");
        if (tags && Array.isArray(tags)) {
            tags = tags.map(function(tag) {
                return tag.selected ? tag.key : null
            }).filter(Boolean);
            if (tags.length) {
                path += (path.indexOf("#/?") > -1 ? "&" : "#/?") +
                    "tags=" + encodeURIComponent(tags.join(","));
            }
        }

        // Open the popup
        var popup  = window.open(path, "picker", [
            "height=" + cfg.height,
            "width=" + cfg.width,
            "menubar=0",
            "resizable=1",
            "status=0",
            "top=" + (screen.height - cfg.height) / 2,
            "left=" + (screen.width - cfg.width) / 2
        ].join(","));

        // The function that handles incoming messages
        var onMessage = function onMessage(e) {

            // only if the message is coming from the patient picker
            if (e.origin === cfg.origin) {

                // OPTIONAL: Send your custom configuration options if
                // needed when the patient browser says it is ready
                if (cfg.pickerSettings && e.data.type === 'ready') {
                    popup.postMessage({
                        type: 'config',
                        data: cfg.pickerSettings
                    }, '*');
                }

                // When the picker requests to be closed:
                // 1. Stop listening for messages
                // 2. Close the popup window
                // 3. Resolve the promise with the new selection (if any)
                if (e.data.type === 'result' || e.data.type === 'close') {
                    window.removeEventListener('message', onMessage);
                    popup.close();
                    dfd.resolve(e.data.data);
                }
            }
        };

        // Now just wait for the user to interact with the patient picker
        window.addEventListener('message', onMessage);
        
        return dfd.promise();
    }

    function humanName(human, separator) {
        var name = human.name || [];
        if (!Array.isArray(name)) {
            name = [ name ];
        }
        name = name[0];
        if (!name) name = { family: [ "No Name Listed" ] };
        
        var out = $.map(["prefix", "given", "family"], function(type) {
            if (!name[type]) {
                name[type] = [ "" ];
            }
            if (!Array.isArray(name[type])) {
                name[type] = [ name[type] ];
            }
            return name[type].join(" ");
        });

        out = $.grep(out, Boolean).join(separator || " ");
        if (name.suffix) {
            out += ", " + name.suffix;
        }

        return out;
    }
    
    function formatAge(dob) {
        if (!dob) return "";
        
        //fix year or year-month style dates 
        if (RE_YEAR.test(dob))
            dob = dob + "-01";
        if (RE_MONTH_YEAR.test(dob))
            dob = dob + "-01"

        return moment(dob).fromNow(true)
            .replace("a ", "1 ")
            .replace(/minutes?/, "min");
    }

    /**
     * Set (create or update) a cookie.
     * @param {String} name The name of the cookie
     * @param {*} value The value of the cookie
     * @param {Number} days (optional) The cookie lifetime in days. If omitted,
     *                                 the cookie is a session cookie.
     * @return {void}
     */
    function setCookie( name, value, days ) {
        if ( String(name).indexOf(";") > -1 ) {
            throw "The cookie name cannot contain ';'";
        }
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    /**
     * Reads a cookie identified by it's name.
     * @param {String} name The name of the cookie
     * @return {String|null} The value of the cookie or null on failure
     */
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') 
                c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) === 0) 
                return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    /**
     * 
     * @param {Array} array 
     */
    function arrayToUnique(array) {
        return array.reduce(function(prev, current) {
            if (prev.indexOf(current) == -1) {
                prev.push(current);
            }
            return prev;
        }, []);
    }

    function scopeToText(scope, isPatient) {
        var out = {
            read  : "",
            write : "",
            access: "",
            other : ""
        };

        if (scope == "smart/orchestrate_launch") {
            out.other = "Allow this application to launch other SMART applications.";
            return out;
        }

        if (scope == "profile") {
            out.read = "Your profile information";
            return out;
        }

        if (scope == "launch") { 
            out.read = "The current patient and encounter selection in the EHR system";
            return out;
        }

        if (scope == "launch/patient") { 
            out.read = "The current patient selection";
            return out;
        }

        if (scope == "launch/encounter") {
            out.read = "The current encounter selection";
            return out;
        }

        if (scope == "online_access") {
            out.access = "The application will be able to access data while you are online (online access).";
            return out;
        }
        
        if (scope == "offline_access") {
            out.access = "The application will be able to access data until you revoke permission (offline access).";
            return out;
        }

        var scopeParts = scope.split(/[/.]/);
        if (scopeParts.length < 2) return out;

        if (scopeParts[1].toLowerCase() == "patient")
            scopeParts[1] = "Demographic";

        var text;
        if (!isPatient) {
            text = (scopeParts[1] == "*") ? "All" : scopeParts[1];
            if (scopeParts[0] == "user") {
                text += " data you have access to in the EHR system";
            } else {
                text += " data on the current patient";
            }
        } else {
            if 	(scopeParts[1] == "*") {
                text = "Your medical information";
            } else {
                text = 'Your information of type "' + scopeParts[1] + '"';
            }
        }

        if (scopeParts[2] == "write" || scopeParts[2] == "*") {
            out.write = text;
        }

        if (scopeParts[2] == "read" || scopeParts[2] == "*") {
            out.read = text;
        }

        return out;
    }

    function scopeListToPermissions(scopes, isPatient) {
        var read = [], write = [], access = [], other = [];
        var _scopes = $.trim(String(scopes || "")).split(/\s+/);
        
        if (_scopes.indexOf("offline_access") > -1 &&
            _scopes.indexOf("online_access") > -1) {
            access.push(
                "You have requested both <code>offline_access</code> and " +
                "<code>online_access</code> scopes. Please make sure you only " +
                "use one of them."
            );
        }

        if (_scopes.indexOf("launch") > -1) {
            if (_scopes.indexOf("launch/Patient") > -1) {
                access.push(
                    "You have requested both <code>launch</code> and <code>launch/Patient</code> scopes. " +
                    "You probably only need to use one of them. The <code>launch</code> scope " +
                    "is used in the EHR launch flow while <code>launch/Patient</code> is for " +
                    "the standalone flow."
                )
            }
            if (_scopes.indexOf("launch/Encounter") > -1) {
                access.push(
                    "You have requested both <code>launch</code> and <code>launch/Encounter</code> scopes. " +
                    "You probably only need to use one of them. The <code>launch</code> scope " +
                    "is used in the EHR launch flow while <code>launch/Encounter</code> is for " +
                    "the standalone flow."
                )
            }
        }

        $.each(_scopes, function(i, scope) {
            var permissions = scopeToText(scope, isPatient);
            if (permissions.read) {
                read.push(permissions.read);
            }
            if (permissions.write) {
                write.push(permissions.write);
            }
            if (permissions.access) {
                access.push(permissions.access);
            }
            if (permissions.other) {
                other.push(permissions.other);
            }
        });

        return {
            read  : arrayToUnique(read),
            write : arrayToUnique(write),
            access: arrayToUnique(access),
            other : arrayToUnique(other)
        };
    }

    function base64UrlUnescape(str) {
        return (str + '==='.slice((str.length + 3) % 4))
            .replace(/-/g, '+')
            .replace(/_/g, '/');
    }

    function base64UrlEscape(str) {
        return str.replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    function base64UrlEncode(str) {
        return base64UrlEscape(btoa(str));
    }

    function base64UrlDecode(str) {
        return atob(base64UrlUnescape(str));
    }

    // Export
    // =========================================================================
    
    var Lib = {
        getPath               : getPath,
        getUrlQuery           : getUrlQuery,
        compileUrlQuery       : compileUrlQuery,
        toCamelCase           : toCamelCase,
        generateUID           : generateUID,
        selectPatients        : selectPatients,
        humanName             : humanName,
        formatAge             : formatAge,
        qsToForm              : qsToForm,
        formToQs              : formToQs,
        setCookie             : setCookie,
        getCookie             : getCookie,
        scopeToText           : scopeToText,
        scopeListToPermissions: scopeListToPermissions,
        base64UrlUnescape     : base64UrlUnescape,
        base64UrlEscape       : base64UrlEscape,
        base64UrlEncode       : base64UrlEncode,
        base64UrlDecode       : base64UrlDecode,
        bool                  : bool
    };

    // Export at window.Lib:
    if (typeof window == "object") {
        Object.defineProperty(window, "Lib", {
            enumerable: true,
            value     : Lib
        });
    }

    if (typeof module == "object" && module.exports) {
        module.exports = Lib;
    }

    return Lib;

})(jQuery);
