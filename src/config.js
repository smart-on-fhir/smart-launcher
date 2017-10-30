const useSSL = process.env.USE_SSL != "false";
const port   = process.env.PORT || 8443;

module.exports = {
  fhirServerR2: process.env.FHIR_SERVER_R2 || "https://sb-fhir-dstu2.smarthealthit.org/smartdstu2/open", // http://localhost:8080/baseDstu2
  fhirServerR3: process.env.FHIR_SERVER_R3 || "https://sb-fhir-stu3.smarthealthit.org/smartstu3/open",
  baseUrl: process.env.BASE_URL || `http${useSSL ? "s" : ""}://localhost:${port}`,
  sandboxTagSystem: process.env.SANDBOX_TAG_SYSTEM || "https://smarthealthit.org/tags",
  authBaseUrl: process.env.AUTH_BASE_URL || "/auth",
  fhirBaseUrl: process.env.FHIR_BASE_URL || "/fhir",
  protectedSandboxWords: (process.env.PROTECTED_SANDBOX_WORDS || "smart,synthea,pro").split(","),
  jwtSecret: process.env.SECRET || "thisisasecret",
  port,
  useSSL,
  oidcKeypair: {
    "kty": "RSA",
    "d": "lkC4dQAf_Qt1UQnSf_k-JVBn7ixvG7RhdPbV8SBx_VbX-v3zR9vh5JD2NHTurtyhIeVZhEMkLOH2rMVsOZdcMT3gGldHbbrUncXOnoFZzFTL6PH8A6nGr64Vf-OdBoFwUhwFw7s0ywKgtaoZYyP4ii8JbK03ex9amD3bhms9HwzNfeznz9dorHy8_EN_enJLzgPL0G4qXE99Q3JIA6509pycUGOTXfg6WQMbKk-9MG6pUXHiKNuTCM6vdhgFyWesz8UkjqRawJlvDIxQBT7oCntOebAgE9EG2UhcNOZmA1hVGeu3oOV_S_jw5x1JIi4OQTozkFLtK02NqCfGMWTCaQ",
    "e": "AQAB",
    "use": "sig",
    "alg": "RS256",
    "n": "5RJvk54BcrmwJH0nUlGERrdlAtfEixCas90GJs6VbcdfgQVa_V5lU3HT-Zxc5rpE_TvRP6j1yW0zEiuQGy1uffd31u27135hFjKodAJDywmGISJ1AeYDYR4TRWpfc7tdQE0h1J2UfxUZEUsDXDa9Nl0B4tjC9FCSyJa3DikHecNIT_goBheV_GllORsWzss0yQ7NQOB9M4zzUhMdN5X0-1z6HooEQiRgg80gwW5b8zVumULUsAHcexBXZMVSbTNSMbPOq7UhlxFbHmgrowtvi68uEcIp46-qGxlU2ZtBNRtXPyWmL-1Mt29euPgdO7_nW00_6UTLsrYMMkpuHtxvNw",
    "kid": "b449e771431b358a24d91d153a3e78e1743e96db",
    "x5t": "b449e771431b358a24d91d153a3e78e1743e96db"
  },
  errors: {
    "missing_parameter"              : "Missing %s parameter",
    "missing_response_type_parameter": "Missing response_type parameter",
    "missing_client_id_parameter"    : "Missing client_id parameter",
    "missing_scope_parameter"        : "Missing scope parameter",
    "missing_state_parameter"        : "Missing state parameter",
    "missing_redirect_uri_parameter" : "Missing redirect_uri parameter",
    "bad_redirect_uri"               : "Bad redirect_uri: %s",
    "bad_audience"                   : "Bad audience value",
    "no_redirect_uri_protocol"       : "Invalid redirect_uri parameter '%s' (must be full URL)",
    "unauthorized"                   : "Unauthorized",
    "form_content_type_required"     : "Invalid request content-type header (must be 'application/x-www-form-urlencoded')",
    "sim_invalid_client_id"          : "Simulated invalid client_id parameter error",
    "sim_invalid_redirect_uri"       : "Simulated invalid redirect_uri parameter error",
    "sim_invalid_scope"              : "Simulated invalid scope error",
    "sim_invalid_client_secret"      : "Simulated invalid client secret error",
    "sim_invalid_token"              : "Simulated invalid token error",
    "sim_expired_refresh_token"      : "Simulated expired refresh token error",
    "invalid_token"                  : "Invalid token: %s",
    "empty_auth_header"              : "The authorization header '%s' cannot be empty",
    "bad_auth_header"                : "Bad authorization header '%s': %s"
  },
  includeEncounterContextInStandaloneLaunch: true
}
