import "mocha"
import { AddressInfo, Server }        from "net";
import { WebDriver, Builder } from "selenium-webdriver"
import chrome                 from "selenium-webdriver/chrome"
import firefox                from "selenium-webdriver/firefox"
import MockServer             from "./mockServer"

// @ts-ignore
import launcher from "../../src"

const config = require("../../src/config");



export let SMART_APP_SERVER: MockServer = new MockServer("App Server");
export let FHIR_SERVER_R2: MockServer   = new MockServer("R2 FHIR Server");
export let FHIR_SERVER_R3: MockServer   = new MockServer("R3 FHIR Server");
export let FHIR_SERVER_R4: MockServer   = new MockServer("R4 FHIR Server");
export let BROWSER: WebDriver;

let launcherServer: Server | null

export const LAUNCHER = {
    baseUrl: "",
    start() {
        return new Promise(resolve => {
            launcherServer = launcher.listen(0, "localhost", () => {
                const address = launcherServer!.address() as AddressInfo
                this.baseUrl = "http://localhost:" + address.port
                console.log(`Launcher listening at ${this.baseUrl}`)
                resolve(this)
            })
        })
    },
    stop() {
        return new Promise((resolve, reject) => {
            if (launcherServer && launcherServer.listening) {
                launcherServer.close((error?: Error) => {
                    if (error) {
                        reject(error)
                    } else {
                        console.log(`Launcher stopped`)
                        resolve(this)
                    }
                })
            } else {
                resolve(this)
            }
        })
    }
};


async function startBrowser() {

    const browser  = process.env.SELENIUM_BROWSER || "chrome"
    const headless = process.env.SELENIUM_BROWSER_HEADLESS === "true"

    let driver = new Builder().forBrowser(browser);
    
    if (browser === "chrome") {
        const options = new chrome.Options()
        options.setAcceptInsecureCerts(true)
        if (headless) {
            options.headless()
        }
        driver.setChromeOptions(options)
    }

    else if (browser === "firefox") {
        const options = new firefox.Options()
        options.setAcceptInsecureCerts(true)
        if (headless) {
            options.headless()
        }
        driver.setFirefoxOptions(options)
    }

    BROWSER = driver.build();
}

async function stopBrowser() {
    if (BROWSER) {
        await BROWSER.quit();
    }
}


let _orig_fhirServerR2 = config.fhirServerR2
let _orig_fhirServerR3 = config.fhirServerR3
let _orig_fhirServerR4 = config.fhirServerR4

before(async () => {
    await SMART_APP_SERVER.start()
    await FHIR_SERVER_R2  .start()
    await FHIR_SERVER_R3  .start()
    await FHIR_SERVER_R4  .start()
    await LAUNCHER.start()
    await startBrowser()
    config.fhirServerR2 = FHIR_SERVER_R2.baseUrl
    config.fhirServerR3 = FHIR_SERVER_R3.baseUrl
    config.fhirServerR4 = FHIR_SERVER_R4.baseUrl
});

after(async () => {
    await SMART_APP_SERVER.stop()
    await FHIR_SERVER_R2  .stop()
    await FHIR_SERVER_R3  .stop()
    await FHIR_SERVER_R4  .stop()
    await LAUNCHER.stop();
    await stopBrowser();
    config.fhirServerR2 = _orig_fhirServerR2
    config.fhirServerR3 = _orig_fhirServerR3
    config.fhirServerR4 = _orig_fhirServerR4
});

beforeEach(async () => {
    FHIR_SERVER_R2  .clear()
    FHIR_SERVER_R3  .clear()
    FHIR_SERVER_R4  .clear()
    SMART_APP_SERVER.clear()
})

export const FHIR_VERSIONS: [string, MockServer][] = [
    ["r2", FHIR_SERVER_R2],
    ["r3", FHIR_SERVER_R3],
    ["r4", FHIR_SERVER_R4]
];


