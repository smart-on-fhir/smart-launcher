module.exports = {
  fhirServerR2: process.env.FHIR_SERVER_R2 || "https://sb-fhir-dstu2.smarthealthit.org/smartdstu2/open",
  fhirServerR3: process.env.FHIR_SERVER_R3 || "https://sb-fhir-stu3.smarthealthit.org/smartstu3/open",
  baseUrl: process.env.BASE_URL || "https://localhost:8443",
  sandboxTagSystem: process.env.SANDBOX_TAG_SYSTEM || "https://smarthealthit.org/tags",
  authBaseUrl: process.env.AUTH_BASE_URL || "/auth",
  fhirBaseUrl: process.env.FHIR_BASE_URL || "/fhir",
  protectedSandboxWords: (process.env.PROTECTED_SANDBOX_WORDS || "smart,synthea,pro").split(","),
  jwtSecret: process.env.SECRET || "thisisasecret",
  port: process.env.PORT || "8443",
  oidcKeypair: {
    "kty": "RSA",
    "d": "lkC4dQAf_Qt1UQnSf_k-JVBn7ixvG7RhdPbV8SBx_VbX-v3zR9vh5JD2NHTurtyhIeVZhEMkLOH2rMVsOZdcMT3gGldHbbrUncXOnoFZzFTL6PH8A6nGr64Vf-OdBoFwUhwFw7s0ywKgtaoZYyP4ii8JbK03ex9amD3bhms9HwzNfeznz9dorHy8_EN_enJLzgPL0G4qXE99Q3JIA6509pycUGOTXfg6WQMbKk-9MG6pUXHiKNuTCM6vdhgFyWesz8UkjqRawJlvDIxQBT7oCntOebAgE9EG2UhcNOZmA1hVGeu3oOV_S_jw5x1JIi4OQTozkFLtK02NqCfGMWTCaQ",
    "e": "AQAB",
    "use": "sig",
    "alg": "RS256",
    "n": "5RJvk54BcrmwJH0nUlGERrdlAtfEixCas90GJs6VbcdfgQVa_V5lU3HT-Zxc5rpE_TvRP6j1yW0zEiuQGy1uffd31u27135hFjKodAJDywmGISJ1AeYDYR4TRWpfc7tdQE0h1J2UfxUZEUsDXDa9Nl0B4tjC9FCSyJa3DikHecNIT_goBheV_GllORsWzss0yQ7NQOB9M4zzUhMdN5X0-1z6HooEQiRgg80gwW5b8zVumULUsAHcexBXZMVSbTNSMbPOq7UhlxFbHmgrowtvi68uEcIp46-qGxlU2ZtBNRtXPyWmL-1Mt29euPgdO7_nW00_6UTLsrYMMkpuHtxvNw",
    "kid": "b449e771431b358a24d91d153a3e78e1743e96db",
    "x5t": "b449e771431b358a24d91d153a3e78e1743e96db"
  } 
}