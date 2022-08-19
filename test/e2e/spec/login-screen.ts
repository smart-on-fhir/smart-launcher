import {
    waitForElementNotLocated,
    waitForElementNotVisible,
    waitForElementVisible
} from "../lib";
import {
    FHIR_VERSIONS,
    BROWSER,
    LAUNCHER
} from "../testContext"


for (const [ver, server] of FHIR_VERSIONS) {
    describe("Login Screen for " + ver, () => {
        it("Renders select for providers and no provider selected", async () => {
            server.mock("/Practitioner", { body: {} })
            await BROWSER.get(`${LAUNCHER.baseUrl}/v/${ver}/login?login_type=provider`);
            await waitForElementVisible(BROWSER, "#user-id")
            await waitForElementNotVisible(BROWSER, "#user-name")
        });
        
        it("Renders select for providers and single provider selected", async () => {
            server.mock("/Practitioner", { body: {} })
            await BROWSER.get(`${LAUNCHER.baseUrl}/v/${ver}/login?login_type=provider&provider=smart-Practitioner-71032702`);
            await waitForElementVisible(BROWSER, "#user-id")
            await waitForElementNotVisible(BROWSER, "#user-name")
        });
        
        it("Renders select for providers and multiple providers selected", async () => {
            server.mock("/Practitioner", { body: {} })
            await BROWSER.get(`${LAUNCHER.baseUrl}/v/${ver}/login?login_type=provider&provider=smart-Practitioner-71032702%2Csmart-Practitioner-71614502`);
            await waitForElementVisible(BROWSER, "#user-id")
            await waitForElementNotVisible(BROWSER, "#user-name")
        });
        
        it("Renders text field in patient mode if no patients are passed", async () => {
            server.mock("/Patient", { body: {} })
            await BROWSER.get(`${LAUNCHER.baseUrl}/v/${ver}/login?login_type=patient&`);
            await waitForElementVisible(BROWSER, "#user-name")
            await waitForElementNotVisible(BROWSER, "#user-id")
        });
        
        it("Renders select in patient mode if multiple patients are passed", async () => {
            server.mock("/Patient", { body: {} })
            await BROWSER.get(`${LAUNCHER.baseUrl}/v/${ver}/login?login_type=patient&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d,de699b5d-d9f4-4208-868c-2ecd80c83ed2`);
            await waitForElementVisible(BROWSER, "#user-id")
            await waitForElementNotVisible(BROWSER, "#user-name")
        });
        
        it("Can hide it's navbar", async () => {
            server.mock("/Patient", { body: {} })
            await BROWSER.get(`${LAUNCHER.baseUrl}/v/${ver}/login?login_type=patient&hide_navbar=1`);
            await waitForElementVisible(BROWSER, "body")
            await waitForElementNotLocated(BROWSER, ".navbar")
        });
    })
}
