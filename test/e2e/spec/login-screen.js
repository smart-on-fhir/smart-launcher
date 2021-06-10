const CFG = require("../config.js");
const BASE = `${CFG.PICKER_URL}/v/r3/login`;

// ?client_id=growth_chart
// &response_type=code
// &scope=patient%2F*.read%20launch
// &redirect_uri=https%3A%2F%2Fsb-apps.smarthealthit.org%2Fapps%2Fgrowth-chart%2F
// &state=3f6b2600-14d9-3775-26c2-015fd488b499
// &aud=
// &launch=eyJsYXVuY2hfZWhyIjoiMSIsInBhdGllbnQiOiJmYjQ4ZGUxYi1lNDg1LTQ1OGEtYWMwZi1jNWE1NGMyNmI1OGQifQ
// &provider=
// &login_type=provider
// &aud_validated=1

exports["Renders select for providers and no provider selected"] = function(browser) {
    browser.url(`${BASE}?login_type=provider`);
    browser.waitForElementVisible("#user-id");
    browser.waitForElementNotVisible("#user-name");
    browser.end();
};

exports["Renders select for providers and single provider selected"] = function(browser) {
    browser.url(`${BASE}?login_type=provider&provider=smart-Practitioner-71032702`);
    browser.waitForElementVisible("#user-id");
    browser.waitForElementNotVisible("#user-name");
    browser.end();
};

exports["Renders select for providers and multiple providers selected"] = function(browser) {
    browser.url(`${BASE}?login_type=provider&provider=smart-Practitioner-71032702%2Csmart-Practitioner-71614502`);
    browser.waitForElementVisible("#user-id");
    browser.waitForElementNotVisible("#user-name");
    browser.end();
};

exports["Renders text field in patient mode if no patients are passed"] = function(browser) {
    browser.url(`${BASE}?login_type=patient&`);
    browser.waitForElementVisible("#user-name");
    browser.waitForElementNotVisible("#user-id");
    browser.end();
};

exports["Renders select in patient mode if multiple patients are passed"] = function(browser) {
    browser.url(`${BASE}?login_type=patient&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d,de699b5d-d9f4-4208-868c-2ecd80c83ed2`);
    browser.waitForElementVisible("#user-id");
    browser.waitForElementNotVisible("#user-name");
    browser.end();
};

exports["Can hide it's navbar"] = function(browser) {
    browser.url(`${BASE}?login_type=patient&hide_navbar=1`);
    browser.waitForElementVisible("body");
    browser.waitForElementNotPresent(".navbar");
    browser.end();
};
