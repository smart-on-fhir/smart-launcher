const FS = require("fs");
const convert = require('pem-jwk');

const HOST = process.env.HOST || "localhost";
const PORT = process.env.LAUNCHER_PORT || process.env.PORT || (process.env.NODE_ENV == "test" ? 8444 : 8443);

const PRIVATE_KEY = FS.readFileSync(__dirname + "/../private-key.pem", "utf8");
const JWK         = convert.pem2jwk(PRIVATE_KEY);

[
  "FHIR_SERVER_R2",
  "FHIR_SERVER_R3",
  "FHIR_SERVER_R4",
  "PICKER_CONFIG_R2",
  "PICKER_CONFIG_R3",
  "PICKER_CONFIG_R4"
].forEach(name => {
  if (!process.env[name]) {
    throw new Error(`The "${name} environment variable must be set`);
  }
});

module.exports = {
  port                 : PORT,
  host                 : HOST,
  fhirServerR2         : process.env.FHIR_SERVER_R2,
  fhirServerR3         : process.env.FHIR_SERVER_R3,
  fhirServerR4         : process.env.FHIR_SERVER_R4,
  baseUrl              : process.env.BASE_URL || `http://${HOST}:${PORT}`,
  jwtSecret            : process.env.SECRET || "thisisasecret",
  accessTokenLifetime  : process.env.ACCESS_TOKEN_LIFETIME || 60, // minutes
  refreshTokenLifeTime : process.env.REFRESH_TOKEN_LIFETIME || 60 * 24 * 365, // minutes
  backendServiceAccessTokenLifetime: process.env.BACKEND_ACCESS_TOKEN_LIFETIME || 15, // minutes
  oidcKeypair: Object.assign({
    "alg": "RS256",
    "kid": "9c37bf73343adb93920a7ae80260b0e57684551e",
    "use": "sig"
  }, JWK),
  includeEncounterContextInStandaloneLaunch: true,
  privateKeyAsPem: PRIVATE_KEY
}
