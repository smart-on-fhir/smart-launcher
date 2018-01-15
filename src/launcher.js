const base64url = require("base64-url");
const lib       = require("./lib");
const Codec     = require("../static/codec.js");
const config    = require("./config");

module.exports = (req, res) => {

    let {
        patient,
        auth_error,
        provider,
        sim_ehr,
        select_encounter,
        launch_uri,
        fhir_ver
    } = req.query;

    const launchParams = {
        launch_ehr: 1, // launch_ehr - signals that we are doing an EHR launch
        sim_ehr: lib.bool(sim_ehr),
        patient,
        provider,
        select_encounter: lib.bool(select_encounter),
        auth_error
    };

    // launch_uri
    launch_uri = String(launch_uri || "").trim();
    if (!launch_uri) {
        return res.status(400).send("launch_uri is required");
    }

    // Make sure we use the correct iss protocol, depending on the launch_uri
    let proto = launch_uri.match(/^https?/);
    if (!proto || !proto[0]) {
        return res.status(400).send("Invalid launch_uri parameter");
    }
    proto = proto[0];

    // fhir_ver
    fhir_ver = parseInt(fhir_ver || "0", 10);
    if (fhir_ver != 2 && fhir_ver != 3) {
        return res.status(400).send("Invalid or missing fhir_ver parameter. It can only be '2' or '3'.");
    }

    // iss
    let iss = lib.buildUrlPath(
        config.baseUrl,
        "v",
        "r" + fhir_ver,
        "fhir"
    ).replace(/^https?/, proto);

    // Build the url
    let url = `${launch_uri}?iss=${encodeURIComponent(iss)}&launch=${
        base64url.encode(JSON.stringify(Codec.encode(launchParams)))
    }`;

    res.redirect(url);
};
