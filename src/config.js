const FS = require("fs");
const convert = require('pem-jwk');

const HOST = process.env.HOST || "localhost";
const PORT = process.env.LAUNCHER_PORT ||
             process.env.PORT ||
             (process.env.NODE_ENV == "test" ? 8444 : 8443);

const PRIVATE_KEY = FS.readFileSync(__dirname + "/../private-key.pem", "utf8");
const PUBLIC_KEY  = FS.readFileSync(__dirname + "/../public-key.pem", "utf8");
const JWK         = convert.pem2jwk(PRIVATE_KEY);

[
  "FHIR_SERVER_R2",
  "FHIR_SERVER_R3",
  "PICKER_CONFIG_R2",
  "PICKER_CONFIG_R3"
].forEach(name => {
  if (!process.env[name]) {
    throw new Error(`The "${name} environment variable must be set`);
  }
});

module.exports = {
  fhirServerR2: process.env.FHIR_SERVER_R2,
  fhirServerR3: process.env.FHIR_SERVER_R3,
  baseUrl: process.env.BASE_URL || `http://${HOST}:${PORT}`,
  sandboxTagSystem: process.env.SANDBOX_TAG_SYSTEM || "https://smarthealthit.org/tags",
  authBaseUrl: process.env.AUTH_BASE_URL || "/auth",
  fhirBaseUrl: process.env.FHIR_BASE_URL || "/fhir",
  protectedSandboxWords: (process.env.PROTECTED_SANDBOX_WORDS || "smart,synthea,pro").split(","),
  jwtSecret: process.env.SECRET || "thisisasecret",
  port: PORT,
  host: HOST,
  oidcKeypair: Object.assign({
    "alg": "RS256",
    "kid": "9c37bf73343adb93920a7ae80260b0e57684551e",
    "use": "sig"
  }, JWK),
  errors: {
    "missing_parameter"               : "Missing %s parameter",
    "invalid_parameter"               : "Invalid %s parameter",
    "missing_response_type_parameter" : "Missing response_type parameter",
    "missing_client_id_parameter"     : "Missing client_id parameter",
    "missing_scope_parameter"         : "Missing scope parameter",
    "missing_state_parameter"         : "Missing state parameter",
    "missing_redirect_uri_parameter"  : "Missing redirect_uri parameter",
    "bad_redirect_uri"                : "Bad redirect_uri: %s",
    "bad_audience"                    : "Bad audience value",
    "no_redirect_uri_protocol"        : "Invalid redirect_uri parameter '%s' (must be full URL)",
    "unauthorized"                    : "Unauthorized",
    "form_content_type_required"      : "Invalid request content-type header (must be 'application/x-www-form-urlencoded')",
    "sim_invalid_client_id"           : "Simulated invalid client_id parameter error",
    "sim_invalid_redirect_uri"        : "Simulated invalid redirect_uri parameter error",
    "sim_invalid_scope"               : "Simulated invalid scope error",
    "sim_invalid_client_secret"       : "Simulated invalid client secret error",
    "sim_invalid_token"               : "Simulated invalid token error",
    "sim_expired_refresh_token"       : "Simulated expired refresh token error",
    "invalid_token"                   : "Invalid token: %s",
    "empty_auth_header"               : "The authorization header '%s' cannot be empty",
    "bad_auth_header"                 : "Bad authorization header '%s': %s",
    "missing_client_assertion_type"   : "Missing client_assertion_type parameter",
    "invalid_client_assertion_type"   : "Invalid client_assertion_type parameter. Must be 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'.",
    "invalid_jti"                     : "Invalid 'jti' value",
    "invalid_aud"                     : "Invalid token 'aud' value. Must be '%s'.",
    "invalid_token_iss"               : "The given service url '%s' does not match the registered '%s'",
    "token_expired_registration_token": "Registration token expired",
    "invalid_registration_token"      : "Invalid registration token: %s",
    "invalid_client_details_token"    : "Invalid client details token: %s",
    "invalid_scope"                   : 'Invalid scope: "%s"',
    "missing_scope"                   : "Empty scope",
    "token_invalid_scope"             : "Simulated invalid scope error",
    "bad_grant_type"                  : "Unknown or missing grant_type parameter"
  },
  includeEncounterContextInStandaloneLaunch: true
}
