module.exports = {
  fhirServerR2: process.env.FHIR_SERVER_R2 || "https://sb-fhir-dstu2.smarthealthit.org/smartdstu2/open",
  fhirServerR3: process.env.FHIR_SERVER_R3 || "https://sb-fhir-stu3.smarthealthit.org/smartstu3/open",
  baseUrl: process.env.BASE_URL || "http://localhost:3055",
  sandboxTagSystem: process.env.SANDBOX_TAG_SYSTEM || "https://smarthealthit.org/tags",
  authBaseUrl: process.env.AUTH_BASE_URL || "/auth",
  fhirBaseUrl: process.env.FHIR_BASE_URL || "/fhir",
  protectedSandboxWords: (process.env.PROTECTED_SANDBOX_WORDS || "smart,synthea,all").split(","),
  jwtSecret: process.env.SECRET || "thisisasecret",
  port: process.env.PORT || "3055",
  oidcKey: 
`MIIEowIBAAKCAQEAnvUyZCs7piYhhMjshljQ+csrA2eYwoK4hmxXy+QfXFhB+ly3
gk0LWVtDQAtOlTuex+G1mUt2e42E73pThNR2mZo87tMFQKeElBWchjUifrOO4YbL
myorVlrP3+Oil0clMyZEZsbSmcc9R/0PFGoxFeU4B6eyavA8Eg23Cyj2kV9Ds5m9
v35z3VsntcFoyt+ObRXDlIdo9K3YKAdP18zvEx+NhIt3c5NBLoX2cfZakihWDs3X
DaekBG5YhhqWMlf4A8BAp2BTu6YHK/8ymjMotixDVSp8KgXKw3RnBgyacpl95oPd
yiaQEzrNz17DPy1j12Y3vFMEFSc/VYHzm577oQIDAQABAoIBAEa6oa5ykjsO0nFM
Gfp5gJr1bPE54n4CPmsJwFMn8VBcsRbetITVFUywUA8qONAsVC1qYCySqGi3gsQw
MQN0qkUUnTJDUR4Aq/xcVWZeNDgeW2A8Y1JqhBgLll1v44Pek03cJCl7JHBqd/kV
P+V8jtTIRpMZakktFf2OfrkHhBcQkZxEAVbthu8/fLl9LDGIFBJTZE80H48dWMiE
1QGdokJgX8k/lA6+Kr5/nMPiP/g1SkIEpsfmdGDB24pEAIRt9RfI0j72qMFY36mg
Uj6H68fkBN1vHyUGP8dIV1nZZ3aSHRehSYnEUJuM59O0diMrGcbpTkE9EouNZrwy
eM5qb7UCgYEAvMt18Cs1zkOvc2gWMesJKEzXz3gwRvIJNXdrGzjirQeN5luCw+Vo
P3QhIRhiatWYfe0fcVcE3odakpHXNJvwdnaAZxpY+k0YpWptuT+hPMME2+hNrAWq
UeRWIGh7eG0w0aLB8JlQnt1cPOkWMzehJwhpfcsnLwMuPRsMgA4QWVMCgYEA14q+
vFITKta90LiCH5PxJI2dFZjG2IU/MmIc85eGxLWgk1mIr38neS9Q9K1hcRs/jr8Y
dxK5UCYM6hP59zFfh8B7yGGgfXOPOa9g7ZrG7PYGv7OMyezhXC+3QCBSPQ0qEKut
npxefnIa+E8b8OzFLXjHN8F5DY5+CnUpQD3X1LsCgYBwkJMCHpFXKS4cDixlmPB9
0cs+zTdjpX3uHgSDV5h3eDCX72n5KPfOFYyHMgXEExR3yIDdz/d8QpGzIDeDC5ME
3sTSNHhmzL7sKZfAQvr8wn5MK6bb8QjLCOx9KC6t79SSuYsOzCqwfeU3//WXlgyE
vFRBh3YWZrwT/OOoGjqPNwKBgQC6dWYnF4FJT9eI1fSLSLoU+wTnB/EMochX15Rg
DbciOFUe4xdhakhFh28rG0nuRLoozJtndqUk9qW5YWqeMvIHR7ZNVFc37135cwQQ
yBJKL1MLR1IF5IvX6ddG/C7obZj0Lu/VBESiciduo1DyjIDOo2sDirUjyx6yAUSc
NGOfvQKBgCpWQkze+7MucceDyHBEy09+byPRmmzYcJDeFKokFpWJXW8lzMeJD3JH
odjMPdAaiF2fIUrj6/Ea3a8TiTROewChVPBNfiqVDJ8hp5CzPEV3XYkMM0lj/7Gn
bk1C6+SxZUGhhJxp1Pi6rl9vshxNv4g9qm046r2iZOBzjDhVTxkZ`
};
