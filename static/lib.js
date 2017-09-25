// @ts-check
var Lib = (function($, undefined) {

    /**
     * Returns the queryString of the current page's URL. That should be the
     * same as `location.search` but without the typical "?" in-front.
     * @returns {String}
     */
    function getUrlQueryString() {
        return window.location.search.replace(/^\?/, "");
    }

    /**
     * Parses the current query string and returns a key/value map of all the
     * parameters.
     * @todo: Handle ampersands 
     * @returns {Object}
     */
    function getUrlQuery(options) {
        var q   = getUrlQueryString()/*.replace("&amp;", "&")*/.split("&");
        var out = {};
        $.each(q, function(i, param) {
            if (!param) {
                return true; // continue
            }
            var tokens = param.split('=');
            var key    = tokens[0];
            if (options && options.camelCaseKeys) {
                key = toCamelCase(key);
            }
            out[key] = decodeURIComponent(tokens[1]);
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

    // Export these at window.Lib:
    return {
        getUrlQueryString: getUrlQueryString,
        getUrlQuery      : getUrlQuery,
        toCamelCase      : toCamelCase,
        generateUID      : generateUID
    };

})(jQuery);
