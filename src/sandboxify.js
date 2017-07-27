const replaceAll = require("replaceall");

// TODO: Add unit tests for this module

function buildUrlPath(...segments) {
	return segments.map( s => s.replace(/^\//, "").replace(/\/$/, "") ).join("\/");
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
	//move id from url to parameter (no current query string)
	url = url.replace(/([A-Z]\w+)(\/([^\/?]+))\/?$/, "$1?_id=$3");
	//move id from url to parameter (retain existing query string)
	url = url.replace(/([A-Z]\w+)(\/([^\/?]+))\/?\?(.+)/, "$1?$4&_id=$3");
	url += (url.indexOf("?") == -1 ? "?" : "&") + "_tag=" + sandboxTags;
	return url;
}

function addAuthToConformance(bodyText, authBaseUrl) {
		let json;
		try {
			json = JSON.parse(bodyText);
		} catch (e) {
			return null;
		}
		if (!json.rest[0].security){
			json.rest[0].security = {}
		}
		json.rest[0].security['extension'] = [{
			"url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
			"extension": [{
				"url": "authorize",
				"valueUri": buildUrlPath(authBaseUrl, "/authorize")
			}, {
				"url": "token",
				"valueUri": buildUrlPath(authBaseUrl, "/token")
			}]
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