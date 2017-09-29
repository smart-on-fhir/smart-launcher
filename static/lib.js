// @ts-check
(function($, undefined) {

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

    // Export
    // =========================================================================
    
    const Lib = {
        getUrlQuery      : getUrlQuery,
        toCamelCase      : toCamelCase,
        generateUID      : generateUID,
        selectPatients   : selectPatients
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
