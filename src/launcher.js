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

        // aud,
        // context_params,
        // show_patient_id,
        // patients,
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

    // debugger;

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



    // const launchParams = {
    //     launch_ehr: 1, // launch_ehr - signals that we are doing an EHR launch
    //     sim_ehr: lib.bool(sim_ehr)
    // };

    //   // Pre-selected patient(s), if any
    //   if (obj.patientRequired && obj.preferredPatients && obj.preferredPatients.length > 0) {
    //     launchParams.b = obj.preferredPatients.replace(/\s*/g, '');
    //   }
    
    //   // Make sure we use the correct iss protocol, depending on the app's launchUrl
    //   let proto = obj.launchUrl.match(/^https?/);
    //   if (!proto || !proto[0]) {
    //     return '';
    //   }
    //   proto = proto[0];
    
    //   // The numeric fhir version
    //   const ver = settings.fhir[obj.stu].versionNumber;
    
      
    
    //   // For simulated ehr (iframe)
    //   if (obj.ehr) {
    //     url = proto + "://launch.smarthealthit.org/ehr.html?app=" + encodeURIComponent(url);
    //   }




    
    
    
    // if (["base64", "binary", "hex", "utf8"].indexOf(enc) == -1) {
    //     enc = undefined;
    // }

    // // create a pair of keys (a private key contains both keys...)
    // const keys = ursa.generatePrivateKey();

    // // reconstitute the private and public keys from a base64 encoding
    // const privatePem = keys.toPrivatePem(enc);
    // const publicPem  = keys.toPublicPem(enc);

    // // make a private key, to be used for encryption
    // const privateKey = ursa.createPrivateKey(privatePem, '', enc);

    // // make a public key, to be used for decryption
    // const publicKey = ursa.createPublicKey(publicPem, enc);

    // res.json({
    //     privateKey: privatePem,
    //     publicKey : publicPem
    // });

};
