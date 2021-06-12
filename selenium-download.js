var selenium = require('selenium-download');
selenium.ensure('./test/e2e/bin', function(error) {
    if (error) {
        console.error(error.stack);
    }
});