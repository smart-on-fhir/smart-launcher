const CFG = require("../config.js");

exports["FHIR Version"] = function(browser) {
    [ "r2", "r3" ].forEach(name => {
        browser.url(`${CFG.PICKER_URL}?fhir_version=${name}`);
        browser.waitForElementVisible("body");
        browser.expect.element('#fhir-version').value.to.equal(name);
    });
    browser.end();
};

exports["Launch Type"] = function(browser) {
    [
        { name: "launch_prov", id: "launch-prov" },
        { name: "launch_pt"  , id: "launch-pt"   },
        { name: "launch_ehr" , id: "launch-ehr"  }
    ].forEach(meta => {
        browser.url(`${CFG.PICKER_URL}?${meta.name}=1`);
        browser.waitForElementVisible("body");
        browser.expect.element('input[name="launch-type"]:checked').to.have.attribute("id").which.equals(meta.id);
    });
    browser.end();
};

exports["Simulate EHR"] = function(browser) {
   
    // Direct
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0`);
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body.login-form");
    browser.closeWindow();
    browser.window_handles(result => browser.switchWindow(result.value[0]));

    // Simulate EHR
    browser.url(`${CFG.PICKER_URL}?sim_ehr=1`);
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body.ehr");
    browser.end();
};

exports["Renders the user-login page if no providers are selected"] = function(browser) {
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0`);
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body.login-form");
    browser.expect.element("#login-type").text.to.equal("Practitioner");
    browser.end();
};

exports["Renders the user-login page if multiple providers are selected"] = function(browser) {
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0&fhir_version=r3&provider=smart-Practitioner-71032702%2Csmart-Practitioner-71614502`);
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body.login-form");
    browser.expect.element("#login-type").text.to.equal("Practitioner");
    browser.end();
};

exports["Does not render the user-login page if one provider is selected"] = function(browser) {
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0&fhir_version=r3&provider=smart-Practitioner-71032702`);
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body");
    browser.waitForElementNotPresent("body.login-form");
    browser.end();
};

exports["Renders the patient picker if no patients are selected"] = function(browser) {
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0&fhir_version=r3&provider=smart-Practitioner-71032702&patient=`);
    browser.waitForElementVisible("body");
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body.patient-picker");
    browser.end();
};

exports["Renders the patient picker if multiple patients are selected"] = function(browser) {
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0&fhir_version=r3&provider=smart-Practitioner-71032702&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d,de699b5d-d9f4-4208-868c-2ecd80c83ed2`);
    browser.waitForElementVisible("body");
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body.patient-picker");
    browser.end();
};

exports["Does not render the patient picker if single patient is selected"] = function(browser) {
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0&fhir_version=r3&provider=smart-Practitioner-71032702&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d`);
    browser.waitForElementVisible("body");
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body");
    browser.waitForElementNotPresent("body.patient-picker");
    browser.end();
};

exports["Can show the encounter selector"] = function(browser) {
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0&fhir_version=r3&provider=smart-Practitioner-71032702&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d&select_encounter=1`);
    browser.waitForElementVisible("body");
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementNotPresent("body.encounter-picker");
    browser.end();
};

exports["Can skip the encounter selector"] = function(browser) {
    browser.url(`${CFG.PICKER_URL}?sim_ehr=0&fhir_version=r3&provider=smart-Practitioner-71032702&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d&select_encounter=0`);
    browser.waitForElementVisible("body");
    browser.click("#ehr-launch-url");
    browser.window_handles(result => browser.switchWindow(result.value[1]));
    browser.waitForElementPresent("body.encounter-picker");
    browser.waitForElementNotPresent("body.encounter-picker");
    browser.end();
};

exports["Can simulate authentication errors"] = function(browser) {
    [
        {
            auth_error: "auth_invalid_client_id",
            message: "Invalid client_id parameter"
        },
        {
            auth_error: "auth_invalid_redirect_uri",
            message: "Invalid redirect_uri parameter"
        },
        {
            auth_error: "auth_invalid_scope",
            message: "Invalid scope parameter"
        }
    ].forEach(error => {
        browser.url(`${CFG.PICKER_URL}?sim_ehr=0&fhir_version=r3&auth_error=${error.auth_error}`);
        browser.waitForElementVisible("body");
        browser.click("#ehr-launch-url");
        browser.window_handles(result => browser.switchWindow(result.value[1]));
        browser.waitForElementPresent("body");
        browser.expect.element("body").text.to.equal(error.message);
        browser.closeWindow();
        browser.window_handles(result => browser.switchWindow(result.value[0]));
    });
    browser.end();
};

exports['@disabled'] = false;
