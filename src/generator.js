const jose          = require("node-jose")
const { whitelist } = require("./lib")

const router = module.exports = require("express").Router({ mergeParams: true });

module.exports = router;

router.get("/rsa", (req, res, next) => {
    jose.JWK.createKey("RSA", 2048, { alg: "RS384" }).then(key => {
        res.json({
            publicKey: key.toPEM(),
            privateKey: key.toPEM(true)
        })
    }, next)
});

router.get("/random", (req, res) => {
    const encodings = ["base64", "binary", "hex", "utf8", "ascii"];
    let enc = whitelist(encodings, String(req.query.enc), "hex");
    
    let len = +(req.query.len || 32);
    if (isNaN(len) || !isFinite(len) || len < 1 || len > 1024) {
        len = 32;
    }

    res.set("content-type", "text/plain")
    res.end(jose.util.randomBytes(len).toString(enc))
});
