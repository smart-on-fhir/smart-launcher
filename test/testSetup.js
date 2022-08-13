require("cross-fetch/polyfill");

const app      = require("../src/index.js")
const BASE_URL = "http://localhost:2345"

let server;

before(done => {
    server = app.listen(2345, done)
})

after(done => {
    if (server) {
        server.close()
    }
    setImmediate(done)
})


module.exports = {
    server,
    BASE_URL
}
