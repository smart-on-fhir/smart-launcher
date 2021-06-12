// @ts-check
const bodyParser          = require("body-parser");
const router              = require("express").Router({ mergeParams: true });
const AuthorizeHandler    = require("./AuthorizeHandler");
const RegistrationHandler = require("./RegistrationHandler");
const TokenHandler        = require("./TokenHandler");
const tokenIntrospection  = require("./tokenIntrospection");


router.get(
    "/authorize",
    AuthorizeHandler.handleRequest
);

router.post("/introspect",
    bodyParser.urlencoded({ extended: false }),
    tokenIntrospection
);

router.post(
    "/authorize",
    bodyParser.urlencoded({ extended: false }),
    AuthorizeHandler.handleRequest
);

router.post(
    "/token",
    bodyParser.urlencoded({ extended: false }),
    TokenHandler.handleRequest
);

// This should handle the client registration used by the back-end services.
router.post(
    "/register",
    bodyParser.urlencoded({ extended: false }),
    RegistrationHandler.handleRequest
);

module.exports = router;
