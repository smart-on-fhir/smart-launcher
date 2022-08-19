import fetch                     from "cross-fetch"
import { URL, URLSearchParams }  from "url"
import assert                    from "assert/strict"
import { By, until }             from "selenium-webdriver"
import { waitForElementLocated } from "../lib"
import { Request, Response }     from "express"
import {
    FHIR_VERSIONS,
    SMART_APP_SERVER,
    BROWSER,
    LAUNCHER
} from "../testContext"
// const jose = require("node-jose")
import jose from "node-jose"

async function loadLauncher({
    fhirVersion,
    launchType = "provider-ehr",
    simulateEhr,
    patient,
    provider,
    skipLogin,
    skipAuth,
    selectEncounter,
    authError,
    launchUrl
}: {
    fhirVersion: string // "r2" | "r3" | "r4"
    launchType?: "provider-ehr" | "patient-portal" | "provider-standalone" | "patient-standalone" | "backend-services" | "cds-hooks"
    patient?: string | string[]
    provider?: string | string[]
    simulateEhr?: boolean
    skipLogin?: boolean
    skipAuth?: boolean
    selectEncounter?: boolean
    authError?: string
    launchUrl?: string
}) {
    const url = new URL("/index.html", LAUNCHER.baseUrl)

    url.searchParams.set("fhir_version_2", fhirVersion)

    switch (launchType) {
        case "backend-services":
            url.searchParams.set("launch_bs", "1");
        break;
        case "provider-ehr":
            url.searchParams.set("launch_ehr", "1");
        break;
        case "patient-portal":
            url.searchParams.set("launch_pp", "1");
        break;
        case "provider-standalone":
            url.searchParams.set("launch_prov", "1");
        break;
        case "patient-standalone":
            url.searchParams.set("launch_pt", "1");
        break;
        case "cds-hooks":
            url.searchParams.set("launch_cds", "1");
        break;
    }

    url.searchParams.set("sim_ehr", simulateEhr ? "1" : "0")

    if (patient) {
        if (Array.isArray(patient)) {
            patient = patient.join(",")
        }
        if (launchType === "patient-portal" || launchType === "patient-standalone") {
            url.searchParams.set("user_pt", patient)
        }
        else if (launchType === "provider-ehr" || launchType === "provider-standalone" || launchType == "cds-hooks") {
            url.searchParams.set("patient", patient)
        }
        else {
            console.warn(`The "patient" option is not applicable for "${launchType}" launch`)
        }
    }

    if (provider) {
        if (Array.isArray(provider)) {
            provider = provider.join(",")
        }
        if (launchType === "provider-ehr" || launchType === "provider-standalone" || launchType == "cds-hooks") {
            url.searchParams.set("provider", provider)
        }
        else {
            console.warn(`The "provider" option is not applicable for "${launchType}" launch`)
        }
    }

    if (skipLogin) {
        if (launchType === "patient-portal" || launchType === "patient-standalone") {
            url.searchParams.set("pt_skip_login", "1")
        }
        else if (launchType === "provider-standalone") {
            url.searchParams.set("prov_skip_login", "1")
        }
        else {
            console.warn(`The "skipLogin" option is not applicable for "${launchType}" launch`)
        }
    }

    if (skipAuth) {
        if (launchType === "patient-portal" || launchType === "patient-standalone") {
            url.searchParams.set("pt_skip_auth", "1")
        }
        else if (launchType === "provider-standalone") {
            url.searchParams.set("prov_skip_auth", "1")
        }
        else {
            console.warn(`The "skipAuth" option is not applicable for "${launchType}" launch`)
        }
    }

    if (selectEncounter) {
        if (launchType === "provider-ehr") {
            url.searchParams.set("select_encounter", "1")
        }
        else {
            console.warn(`The "selectEncounter" option is not applicable for "${launchType}" launch`)
        }
    }

    if (authError) {
        url.searchParams.set("auth_error", authError)
    }

    if (launchUrl) {
        url.searchParams.set("launch_url", launchUrl)
    }

    // console.log(url.href)
    await BROWSER.get(url.href)
}

describe("Main Page", () => {

    for (const [ver] of FHIR_VERSIONS) {
        
        describe("URL parameters for FHIR version " + ver, () => {

            // fhir_version_2 --------------------------------------------------
            it("no other parameters" + ver, async () => {
                await loadLauncher({ fhirVersion: ver })
                const value = await BROWSER.findElement(By.id("fhir-version-2")).getAttribute("value")
                assert.equal(value, ver)
            });

            // launch types ----------------------------------------------------
            it(`provider-standalone launch`, async () => {
                await loadLauncher({ fhirVersion: ver, launchType: "provider-standalone" })
                const id = await BROWSER.findElement(By.css('input[name="launch-type"]:checked')).getAttribute("id")
                assert.equal(id, "launch-prov")
            });

            it(`patient-standalone launch`, async () => {
                await loadLauncher({ fhirVersion: ver, launchType: "patient-standalone" })
                const id = await BROWSER.findElement(By.css('input[name="launch-type"]:checked')).getAttribute("id")
                assert.equal(id, "launch-pt")
            });

            it(`provider-ehr launch`, async () => {
                await loadLauncher({ fhirVersion: ver, launchType: "provider-ehr" })
                const id = await BROWSER.findElement(By.css('input[name="launch-type"]:checked')).getAttribute("id")
                assert.equal(id, "launch-ehr")
            });

            it(`backend-services launch`, async () => {
                await loadLauncher({ fhirVersion: ver, launchType: "backend-services" }) 
                const id = await BROWSER.findElement(By.css('input[name="launch-type"]:checked')).getAttribute("id")
                assert.equal(id, "launch-bs")
            });

            it(`cds-hooks launch`, async () => {
                await loadLauncher({ fhirVersion: ver, launchType: "cds-hooks" }) 
                const id = await BROWSER.findElement(By.css('input[name="launch-type"]:checked')).getAttribute("id")
                assert.equal(id, "launch-cds")
            });

            it(`patient-portal launch`, async () => {
                await loadLauncher({ fhirVersion: ver, launchType: "patient-portal" })
                const id = await BROWSER.findElement(By.css('input[name="launch-type"]:checked')).getAttribute("id")
                assert.equal(id, "launch-pp")
            });

            // patient ---------------------------------------------------------
            it(`patient=xyz`, async () => {
                await loadLauncher({ fhirVersion: ver, patient: "xyz" })
                const value = await BROWSER.findElement(By.id('patient')).getAttribute("value")
                assert.equal(value, "xyz")
            });

            // provider --------------------------------------------------------
            it(`provider=xyz`, async () => {
                await loadLauncher({ fhirVersion: ver, provider: "xyz" })
                const value = await BROWSER.findElement(By.id('provider')).getAttribute("value")
                assert.equal(value, "xyz")
            });

            // Select encounter ------------------------------------------------
            it(`select_encounter=1`, async () => {
                await loadLauncher({ fhirVersion: ver, selectEncounter: true })
                await BROWSER.findElement(By.css('input[name="select-encounter"]:checked'))
            });

            // Simulated error -------------------------------------------------
            const errors = [
                "auth_invalid_client_id",
                "auth_invalid_redirect_uri",
                "auth_invalid_scope",
                "auth_invalid_client_secret",
                "token_invalid_token",
                "token_expired_refresh_token",
                "token_expired_registration_token",
                "token_invalid_scope",
                "invalid_jti",
                "request_invalid_token",
                "request_expired_token"
            ];

            for (const error of errors) {
                it(`auth_error=${error}`, async () => {
                    await loadLauncher({ fhirVersion: ver, authError: error })
                    const val = await BROWSER.findElement(By.id('auth-error')).getAttribute("value")
                    assert.equal(val, error)
                });
            }

            // pt_skip_auth ----------------------------------------------------
            it(`launch_pt=1&pt_skip_auth=1`, async () => {
                await loadLauncher({ fhirVersion: ver, skipAuth: true, launchType: "patient-standalone" })
                const val = await BROWSER.findElement(By.id('pt-skip-auth')).getAttribute("checked")
                assert.equal(val, 'true')
            });

            it(`launch_pt=1&pt_skip_auth=0`, async () => {
                await loadLauncher({ fhirVersion: ver, skipAuth: false, launchType: "patient-standalone" })
                const val = await BROWSER.findElement(By.id('pt-skip-auth')).getAttribute("checked")
                assert.notEqual(val, 'false')
            });

            it(`launch_prov=1&pt_skip_auth=1`, async () => {
                await loadLauncher({ fhirVersion: ver, skipAuth: true, launchType: "provider-standalone" })
                const val = await BROWSER.findElement(By.id('pt-skip-auth')).getAttribute("checked")
                assert.equal(val, 'true')
            });

            it(`launch_prov=1&pt_skip_auth=0`, async () => {
                await loadLauncher({ fhirVersion: ver, skipAuth: false, launchType: "provider-standalone" })
                const val = await BROWSER.findElement(By.id('pt-skip-auth')).getAttribute("checked")
                assert.notEqual(val, 'false')
            });

            it(`launch_pp=1&pt_skip_auth=1`, async () => {
                await loadLauncher({ fhirVersion: ver, skipAuth: true, launchType: "patient-portal" })
                const val = await BROWSER.findElement(By.id('pt-skip-auth')).getAttribute("checked")
                assert.equal(val, 'true')
            });

            it(`launch_pp=1&pt_skip_auth=0`, async () => {
                await loadLauncher({ fhirVersion: ver, skipAuth: false, launchType: "patient-portal" })
                const val = await BROWSER.findElement(By.id('pt-skip-auth')).getAttribute("checked")
                assert.notEqual(val, 'false')
            });
        })
    }
})



for (const [ver, fhirServer] of FHIR_VERSIONS) {
    ((ver, fhirServer) => {
        describe(ver + " - Various flows", () => {
            
            it ("Can simulate EHR without EHR UI", async () => {

                // Load launcher for EHR launch without simulated EHR UI, and with patient and provider preselected
                await BROWSER.get(`${LAUNCHER.baseUrl}/?fhir_version_2=${ver}&sim_ehr=0&provider=provId&patient=patId`);

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.read launch"        );
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock redirect url of the app
                SMART_APP_SERVER.mock("/index.html", { body: "Hello World" })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()

                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")

                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);

                const text = await BROWSER.executeScript("return document.body.innerText")

                assert.equal(text, "Hello World", "App failed to launch")
            
                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);

            })

            it ("Can simulate EHR within EHR UI", async () => {

                // Load launcher for EHR launch without simulated EHR UI and with patient and provider preselected
                await BROWSER.get(`${LAUNCHER.baseUrl}/?fhir_version_2=${ver}&sim_ehr=1&provider=provId&patient=patId`);

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    headers: {
                        "content-type": "text/html"
                    },
                    handler(req: Request, res: Response) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.read launch"        );
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock redirect url of the app
                SMART_APP_SERVER.mock("/index.html", { body: "Hello World" })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Patient/patId", { status: 200, body: {} })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html");

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()

                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")

                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);

                // Verify that the EHR UI has been loaded
                await waitForElementLocated(BROWSER, "body.ehr iframe#frame")

                await BROWSER.switchTo().frame(BROWSER.findElement(By.id("frame")))
                
                await BROWSER.wait(async () => {
                    const href = String(await BROWSER.executeScript("return location.href") || "")
                    return href.startsWith(SMART_APP_SERVER.baseUrl + "/index.html") &&
                        href.includes("state=") &&
                        href.includes("code=");
                }, 1000, "The redirect url was not loaded into the EHR frame")
                
                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            it ("Renders the user-login page if no providers are selected", async () => {
                
                // Load launcher for EHR launch without simulated EHR UI
                await BROWSER.get(`${LAUNCHER.baseUrl}/?fhir_version_2=${ver}&sim_ehr=0`);

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.* user/*.* launch openid fhirUser profile offline_access");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Practitioner", { status: 200, body: {} })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                
                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()

                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);
                
                await BROWSER.wait(until.urlContains(`${LAUNCHER.baseUrl}/v/${ver}/login?`))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            it ("Renders the user-login page if multiple providers are selected", async () => {
                
                // Load launcher for EHR launch without simulated EHR UI
                await BROWSER.get(`${LAUNCHER.baseUrl}/?sim_ehr=0&fhir_version_2=${ver}&provider=smart-Practitioner-71032702%2Csmart-Practitioner-71614502`);

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.* user/*.* launch openid fhirUser profile offline_access");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Practitioner", { body: {} })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();
                
                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()
                
                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);
                
                await BROWSER.wait(until.urlContains(`${LAUNCHER.baseUrl}/v/${ver}/login?`))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            it ("Renders the user-login page even if exactly one provider is selected", async () => {
                
                // Load launcher for EHR launch without simulated EHR UI
                await BROWSER.get(
                    `${LAUNCHER.baseUrl}/` +
                    `?sim_ehr=0` +
                    `&fhir_version_2=${ver}` +
                    `&provider=smart-Practitioner-71032702` //+
                    // `&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d`
                );

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "user/*.* launch openid fhirUser profile");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Practitioner", { body: {} })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                
                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()
                
                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);
                
                await BROWSER.wait(until.urlContains(`${LAUNCHER.baseUrl}/v/${ver}/login?`))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            it ("Renders the patient picker if no patients are selected", async () => {
                
                // Load launcher for EHR launch without simulated EHR UI
                await BROWSER.get(`${LAUNCHER.baseUrl}/?sim_ehr=0&fhir_version_2=${ver}&provider=smart-Practitioner-71032702&patient=`);

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.* user/*.* launch openid fhirUser profile offline_access");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Practitioner", { status: 200, body: {} })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                
                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()
                
                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);
                
                await BROWSER.wait(until.urlContains(`${LAUNCHER.baseUrl}/v/${ver}/login?`))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            it ("Renders the patient picker if multiple patients are selected", async () => {
                
                // Load launcher for EHR launch without simulated EHR UI
                await BROWSER.get(`${LAUNCHER.baseUrl}/?sim_ehr=0&fhir_version_2=${ver}&provider=smart-Practitioner-71032702&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d,de699b5d-d9f4-4208-868c-2ecd80c83ed2`);

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.* user/*.* launch openid fhirUser profile offline_access");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Practitioner", { status: 200, body: {} })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                
                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()
                
                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);
                
                await BROWSER.wait(until.urlContains(`${LAUNCHER.baseUrl}/v/${ver}/login?`))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            it ("Does not render the patient picker if single patient is selected", async () => {
                
                // Load launcher for EHR launch without simulated EHR UI
                await loadLauncher({
                    fhirVersion: ver,
                    // launchType: "patient-portal",
                    provider: "test-provider",
                    patient: "test-patient",
                    // skipLogin: true,
                    // skipAuth: true,
                    simulateEhr: false
                })

                // http://localhost:8443/sample-app/launch.html
                //     ?iss=http%3A%2F%2Flocalhost%3A8443%2Fv%2Fr2%2Ffhir
                //     &launch=eyJhIjoiMSIsImsiOiIxIiwiYiI6InNtYXJ0LVByYWN0aXRpb25lci03MTAzMjcwMiIsImkiOiIxIiwiaiI6IjEifQ

                // await BROWSER.get(
                //     `${LAUNCHER.baseUrl}/` +
                //     `?sim_ehr=0` +
                //     `&fhir_version_2=${ver}` +
                //     `&user_pt=smart-Practitioner-71032702` +
                //     `&pt_skip_login=1` +
                //     `&launch_pp=1` +
                //     `&patient=fffff` +

                //     `&prov_skip_auth=1` +
                //     `&pt_skip_auth=1` +
                //     `&pt_skip_login=1` +
                    
                //     `&provider=ddf%2Ce443ac58-8ece-4385-8d55-775c1b8f3a37`
                // );
                
                // console.log(await BROWSER.getCurrentUrl())

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.* user/*.* launch offline_access");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock the redirect url of the app
                SMART_APP_SERVER.mock("/index.html", { body: "Hello World" })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Practitioner", { body: {} })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()
                
                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);

                await BROWSER.wait(until.urlContains(SMART_APP_SERVER.baseUrl + "/index.html"))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            // TODO: Figure out why encounter picker is not shown
            it.skip ("Can show the encounter selector", async () => {
                
                // Load launcher for EHR launch without simulated EHR UI
                // await BROWSER.get(`${LAUNCHER.baseUrl}/?sim_ehr=0&fhir_version_2=${ver}&provider=smart-Practitioner-71032702&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d&select_encounter=1`);
                await loadLauncher({
                    fhirVersion: ver,
                    // launchType: "patient-portal",
                    provider: "test-provider",
                    patient: "test-patient",
                    // skipLogin: true,
                    // skipAuth: true,
                    simulateEhr: false,
                    selectEncounter: true,
                    launchUrl: SMART_APP_SERVER.baseUrl + "/launch.html"
                })

                console.log(await BROWSER.getCurrentUrl())

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.* patient/Encounter.* launch launch/encounter launch/patient");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Practitioner", { status: 200, body: {} })

                // Set #launch-url
                // await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                
                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()
                
                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);
                
                console.log(await BROWSER.getCurrentUrl())
                // await BROWSER.wait(until.urlContains(LAUNCHER.baseUrl + "/v/r4/encounter?"))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            it ("Can skip the encounter selector", async () => {
                
                // Load launcher for EHR launch without simulated EHR UI
                await loadLauncher({
                    fhirVersion: ver,
                    provider: "smart-Practitioner-71032702",
                    patient: "fb48de1b-e485-458a-ac0f-c5a54c26b58d",
                    simulateEhr: false,
                    selectEncounter: true,
                    launchUrl: SMART_APP_SERVER.baseUrl + "/launch.html"
                })

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.* user/*.* launch");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock the redirect url of the app
                SMART_APP_SERVER.mock("/index.html", { body: "Hello World" })

                // Mock requests made by the EHR frame
                fhirServer.mock("/Practitioner", { status: 200, body: {} })

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()
                
                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);
                
                await BROWSER.wait(until.urlContains(SMART_APP_SERVER.baseUrl + "/index.html"))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })
            
            describe.skip("Can simulate authentication errors", () => {
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

                    it (error.message, async () => {
                        
                        // Load launcher for EHR launch without simulated EHR UI
                        await loadLauncher({
                            fhirVersion: ver,
                            simulateEhr: false,
                            authError: error.auth_error,
                            launchUrl: SMART_APP_SERVER.baseUrl + "/launch.html"
                        })

                        console.log(await BROWSER.getCurrentUrl())

                        // Mock launch url of the app
                        SMART_APP_SERVER.mock("/launch.html", {
                            handler(req, res) {
                                console.log("=====>", req.query)
                                const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                                redirect.searchParams.set("response_type", "code"                         );
                                redirect.searchParams.set("client_id"    , "whatever"                 );
                                redirect.searchParams.set("scope"        , "patient/*.* user/*.* launch offline_access");
                                redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                                redirect.searchParams.set("aud"          , req.query.iss + ""             );
                                redirect.searchParams.set("state"        , "123"          );
                                res.redirect(redirect.href);
                            }
                        })

                        // http://localhost:8443/sample-app/launch.html
                        //     ?iss=http%3A%2F%2Flocalhost%3A8443%2Fv%2Fr4%2Ffhir
                        //     &launch=eyJhIjoiMSIsImQiOjJ9

                        // Mock requests made by the EHR frame
                        fhirServer.mock("/Practitioner", { status: 200, body: {} })

                        // Click on "Launch"
                        await BROWSER.findElement(By.id("ehr-launch-url")).click();
                        
                        // Find all windows/tabs
                        const windowHandles = await BROWSER.getAllWindowHandles()
                        
                        // The launch should have opened new window or tab
                        assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                        
                        // switch to the new window
                        await BROWSER.switchTo().window(windowHandles[1]);
                       
                        // console.log(await BROWSER.getCurrentUrl())
                        // await BROWSER.wait(until.elementTextContains(BROWSER.findElement(By.css("body")), error.message))

                        // Close the window
                        await BROWSER.close()

                        // switch back to the new launcher window
                        await BROWSER.switchTo().window(windowHandles[0]);
                    })
                });

            })

            it.skip ("Authorization using client secret", async () => {

                const clientSecret = "secret"
                
                await BROWSER.get(`${LAUNCHER.baseUrl}/?sim_ehr=0&fhir_version_2=${ver}&provider=smart-Practitioner-71032702&patient=fb48de1b-e485-458a-ac0f-c5a54c26b58d`);

                // Mock launch url of the app
                SMART_APP_SERVER.mock("/launch.html", {
                    handler(req, res) {
                        const redirect = new URL(`${LAUNCHER.baseUrl}/v/${ver}/auth/authorize`);
                        redirect.searchParams.set("response_type", "code"                         );
                        redirect.searchParams.set("client_id"    , "my-client-id"                 );
                        redirect.searchParams.set("scope"        , "patient/*.* user/*.* launch openid fhirUser profile offline_access");
                        redirect.searchParams.set("redirect_uri" , SMART_APP_SERVER.baseUrl + "/index.html");
                        redirect.searchParams.set("aud"          , req.query.iss + ""             );
                        redirect.searchParams.set("state"        , req.query.launch + ""          );
                        res.redirect(redirect.href);
                    }
                })

                // Mock redirect url of the app
                SMART_APP_SERVER.mock("/index.html", { 
                    handler(req, res, next) {
                        console.log("=====>", req.url)
                        const body = new URLSearchParams()
                        body.set("code", req.query.code + "")
                        body.set("redirect_uri", req.query.redirectUri + "")
                        body.set("grant_type", "authorization_code")

                        const token = Buffer.from("my-client-id:" + clientSecret).toString("base64")

                        fetch(LAUNCHER.baseUrl + "/v/r4/auth/token", {
                            method: "POST",
                            headers: {
                                "content-type": "application/x-www-form-urlencoded",
                                authorization: "Basic " + token
                            },
                            body
                        })
                        .then(res => {
                            if (!res.ok) {
                                throw res.status + " " + res.statusText
                            }
                            return res
                        })
                        .then(res => res.text())
                        .then(txt => {
                            console.log(txt)
                            res.end(txt)
                        })
                        .catch(next)
                    }
                })

                // Set #launch-url
                await BROWSER.findElement(By.id("launch-url")).sendKeys(SMART_APP_SERVER.baseUrl + "/launch.html")

                // Click on "Launch"
                await BROWSER.findElement(By.id("ehr-launch-url")).click();

                
                // Find all windows/tabs
                const windowHandles = await BROWSER.getAllWindowHandles()
                
                // The launch should have opened new window or tab
                assert.equal(windowHandles.length, 2, "No new tab or window was opened")
                
                // switch to the new window
                await BROWSER.switchTo().window(windowHandles[1]);
                
                await BROWSER.wait(until.urlContains(SMART_APP_SERVER.baseUrl + "/index.html"))

                // Close the window
                await BROWSER.close()

                // switch back to the new launcher window
                await BROWSER.switchTo().window(windowHandles[0]);
            })

            it.skip ("Asymmetric auth using JWK", async () => {
                const pair = await jose.JWK.createKey("RSA", 2048, { alg: "RS384" })
                const publicKey = pair.toPEM()
                const privateKey = pair.toPEM(true)
                console.log(pair.toJSON(true))
            })

            it ("Asymmetric auth using un-extractable CryptoKey")

            describe("PKCE", () => {})

        })
    })(ver, fhirServer)
}