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

    // Export
    // =========================================================================
    
    const Lib = {
        getUrlQuery      : getUrlQuery,
        toCamelCase      : toCamelCase,
        generateUID      : generateUID
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
