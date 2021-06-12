
module.exports = {
    "src_folders" : ["test/e2e/spec"],
    "output_folder" : "test/e2e/reports",
    "custom_commands_path" : "",
    "custom_assertions_path" : "",
    "page_objects_path" : "",
    "globals_path" : "test/e2e/globals.js",

    "selenium" : {
        "start_process" : true,
        "server_path" : "test/e2e/bin/selenium.jar",
        "log_path" : "test/e2e",
        "host" : "127.0.0.1",
        "port" : 4444,
        "cli_args" : {
            "webdriver.chrome.driver" : "test/e2e/bin/chromedriver",
            "webdriver.ie.driver" : ""
        }
    },

    "test_settings" : {
        "default" : {
            "launch_url" : "http://localhost",
            "selenium_port"  : 4444,
            "selenium_host"  : "localhost",
            "silent": true,
            "screenshots" : {
                "enabled" : false,
                "path" : "test/e2e/screenshots"
            },
            "desiredCapabilities": {
                "browserName": "chrome",
                "javascriptEnabled": true,
                "acceptSslCerts": true
            }
        }
    }
};
