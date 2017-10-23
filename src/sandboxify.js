const replaceAll = require("replaceall");

// TODO: Add unit tests for this module

function buildUrlPath(...segments) {
    return segments.map( s => String(s).replace(/^\//, "").replace(/\/$/, "") ).join("\/");
}

function normalizeUrl(url) {
    return buildUrlPath(url).toLowerCase();
}

function adjustRequestBody(json, system, sandboxes) {
    (json.entry || [{resource: json}]).forEach( entry => {
        if (entry.request) {
            entry.request.url = 
                adjustUrl(entry.request.url, entry.request.method.toUpperCase() == "GET", sandboxes);
        }

        let resource = entry.resource;
        if (!resource.meta) {
            resource.meta = {tag: [{system: system, code: sandboxes[0]}]};
        } else if (!resource.meta.tag) {
            resource.meta.tag =  [{system: system, code: sandboxes[0]}];
        } else {
            resource.meta.tag = resource.meta.tag.filter( t => t.system != system );
            resource.meta.tag.push({system: system, code: sandboxes[0]});
        }
    });
    return json;
}

function adjustUrl(url, isGet, sandboxes) {
    if (!sandboxes) return url;
    var sandboxTags = isGet ? sandboxes.join(",") : sandboxes[0];

    url = url.replace(/\/\?/, "?");
    
    // move id from url to parameter (no current query string)
    url = url.replace(/([A-Z]\w+)(\/([^_][^\/?]+))\/?$/, "$1?_id=$3");
    // url = url.replace(/([A-Z]\w+)(\/([^\/?]+))\/?$/, "$1?_id=$3");
    
    // move id from url to parameter (retain existing query string)
    url = url.replace(/([A-Z]\w+)(\/([^_][^\/?]+))\/?\?(.+)/, "$1?$4&_id=$3");
    url += (url.indexOf("?") == -1 ? "?" : "&") + "_tag=" + sandboxTags;
    return url;
}

/**
 * Given a conformance statement (as JSON string), replaces the auth URIs with
 * new ones that point to our proxy server.
 * @param {String} bodyText    A conformance statement as JSON string
 * @param {String} authBaseUrl The baseUrl of our server
 * @returns {Object|null} Returns the modified JSON object or null in case of error
 */
function addAuthToConformance(bodyText, authBaseUrl) {
    let json;
    try {
        json = JSON.parse(bodyText);
        if (!json.rest[0].security){
            json.rest[0].security = {};
        }
    } catch (e) {
        return null;
    }

    // TODO: Add the register endpoint too
    json.rest[0].security.extension = [{
        "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
        "extension": [
            {
                "url": "authorize",
                "valueUri": buildUrlPath(authBaseUrl, "/authorize")
            },
            {
                "url": "token",
                "valueUri": buildUrlPath(authBaseUrl, "/token")
            }
        ]
    }];

    return json;
}

function adjustResponseUrls(bodyText, fhirUrl, requestUrl, fhirBaseUrl, requestBaseUrl) {
    bodyText = replaceAll(fhirUrl, requestUrl, bodyText);
    //allow non-encoded commas
    bodyText = replaceAll(fhirUrl.replace(",", "%2C"), requestUrl, bodyText);
    bodyText = replaceAll(fhirBaseUrl, requestBaseUrl, bodyText);
    return bodyText;
}

function unbundleResource(bundle) {
    let json;
    try {
        json = JSON.parse(bundle);
        return json.entry[0].resource;
    } catch (e) {
        return null;
    }
}

module.exports = { 
    adjustRequestBody, adjustUrl, addAuthToConformance, 
    buildUrlPath, normalizeUrl, adjustResponseUrls, unbundleResource
};