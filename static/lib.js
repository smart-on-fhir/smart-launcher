// @ts-check
(function($, undefined) {

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
        return path.split(".").reduce((out, key) => out ? out[key] : undefined, obj)
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
            var target = $('[name="' + key + '"], #' + key.replace(/_/g, "-"));
            if (target.is(":checkbox,:radio")) {
                target.prop("checked", (/^(1|true|yes)$/i).test(value));
            } else {
                target.val(value);
            }
        });
    }

    function formToQs() {
        var qs = {};
        $("input,select").filter("[id], [name]").each( function() {
            var target = $(this);
            var key = (this.id || this.name).replace(/-/g, "_");
            if (target.is(":checkbox")) {
                qs[key] = target.prop("checked") ? "1" : "0";
            } else if (target.is(":radio")) {
                if(target.prop("checked")) qs[key] = "1";
            } else {
                qs[key] = (target.val() || "");						
            }
        });

        var sortedQs = Object.keys(qs).sort().map(function(key) {
            return key + "=" + encodeURIComponent(qs[key]);
        }).join("&");

        var newUrl = location.href.split("?")[0] + "?" + sortedQs;
        if (history && newUrl != location.href) {
            if (typeof history.replaceState == "function") {
                history.replaceState({}, document.title, newUrl);
            } else {
                location.replace(newUrl);
            }
        }
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
        return (str.toLowerCase().split(/[_\-]/).map(function(seg, i) {
            return (!upper && i === 0 ? seg[0] : seg[0].toUpperCase()) + seg.slice(1);
        })).join("");
    }

    //this is temporary - should use a better algorithm to prevent conflicts
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
        let popup  = window.open(path, "picker", [
            "height=" + cfg.height,
            "width=" + cfg.width,
            "menubar=0",
            "resizable=1",
            "status=0",
            "top=" + (screen.height - cfg.height) / 2,
            "left=" + (screen.width - cfg.width) / 2
        ].join(","));

        // The function that handles incoming messages
        const onMessage = function onMessage(e) {

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
        if (/\d{4}$/.test(dob))
            dob = dob + "-01";
        if (/\d{4}-d{2}$/.test(dob))
            dob = dob + "-01"

        return moment(dob).fromNow(true)
            .replace("a ", "1 ")
            .replace(/minutes?/, "min");
    }

    // Export
    // =========================================================================
    
    const Lib = {
        getPath          : getPath,
        getUrlQuery      : getUrlQuery,
        compileUrlQuery  : compileUrlQuery,
        toCamelCase      : toCamelCase,
        generateUID      : generateUID,
        selectPatients   : selectPatients,
        humanName        : humanName,
        formatAge        : formatAge,
        qsToForm         : qsToForm,
        formToQs         : formToQs
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
