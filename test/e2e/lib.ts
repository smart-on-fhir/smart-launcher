import { until, WebDriver, Locator, WebElementPromise } from "selenium-webdriver"



const TIMEOUT = 1000

export function waitForElementNotLocated(driver: WebDriver, locator: Locator | string, timeout = TIMEOUT) {
    if (typeof locator === "string") {
        locator = { css: locator };
    }

    function test(remaining = timeout) {
        return driver.findElement(locator as Locator).then(
            () => {
                if (remaining) {
                    remaining = Math.max(remaining - 100, 0);
                    new Promise(resolve => {
                        setTimeout(resolve, Math.min(remaining, 100))
                    }).then(() => test(remaining))
                }
            },
            () => true
        );
    }

    return driver.wait(test, timeout);
}

export function waitForElementVisible(driver: WebDriver, locator: Locator | string, timeout = TIMEOUT): WebElementPromise {
    if (typeof locator === "string") {
        locator = { css: locator };
    }
    return driver.wait(until.elementIsVisible(driver.findElement(locator)), timeout);
}

export function waitForElementNotVisible(driver: WebDriver, locator: Locator | string, timeout = TIMEOUT): WebElementPromise {
    if (typeof locator === "string") {
        locator = { css: locator };
    }
    return driver.wait(until.elementIsNotVisible(driver.findElement(locator)), timeout);
}

export function waitForElementLocated(driver: WebDriver, locator: Locator | string, timeout = TIMEOUT): WebElementPromise {
    if (typeof locator === "string") {
        locator = { css: locator };
    }
    return driver.wait(until.elementLocated(locator), timeout);
}
