# SMART/FHIR proxy server and app launcher
Launcher for SMART apps

## Installation
Make sure you have `Git` and `NodeJS` 16 or higher, and then run:
```sh
git clone https://github.com/smart-on-fhir/smart-launcher.git
cd smart-launcher
npm i
```

## Usage

You can use existing NPM scripts from within the project folder for common tasks:
### Start the server
```sh
npm start
```
Note that this will fail until you create a `.env` file with some required settings. Minimal example (only the required settings):
```
FHIR_SERVER_R2="https://r2.smarthealthit.org"
FHIR_SERVER_R3="https://r3.smarthealthit.org"
FHIR_SERVER_R4="https://r4.smarthealthit.org"
PICKER_CONFIG_R2="r2"
PICKER_CONFIG_R3="r3"
PICKER_CONFIG_R4="r4"
```

### Test
To run the tests execute
```sh
npm test

# or this to also generate a coverage report
npm run test:cover
```

### Develop
If you want to modify something run
```sh
npm run dev
```
This will watch for changes and restart the server automatically. It will also run the tests on every change.

### OIDC Keys generation
To generate new private and public keys make sure you have `openssl` (comes pre-installed on Mac), `cd` to the project root and execute:
```sh
npm run cert
```
Then re-start the server and it will use the new keys.

### Notes about jwt.io
People often use https://jwt.io/ to generate and validate tokens. However, it seems that the RS256 signature verification feature expects you to paste `x.509` formatted public key or certificate and does not work with PEM-encoded PKCS#1 public keys. For that reason, if you want to manually verify your token at https://jwt.io/, you will need to provide the original x.509 version of the public key that you can find at the `/public_key` endpoint of the server.


### Using Docker
```
docker run -t -p 9009:80 smartonfhir/smart-launcher:latest
```
<!--
docker build -t smartonfhir/smart-launcher:latest .
docker push smartonfhir/smart-launcher:latest
-->
