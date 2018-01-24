# SMART/FHIR proxy server and app launcher


## OIDC Keys generation
To generate new private and public keys make sure you have `openssl` (comes pre-installed with the Mac), `cd` to the project root and execute:
```sh
npm run cert
```
Then re-start the server and it will use the new keys.

## OIDC Token verification
If you want to verify the tokens follow this procedure:
1. Point your server to `/.well-known/openid-configuration/`. This should render a JSON with a link to another file like this:
```json
{
    "jwks_uri": "http://localhost:8443/keys"
}
```
2. Follow that link and it should return an array with one or more JWK keys like this:
```js
{
    "keys": [
        {
            "alg": "RS256",
            "kid": "9c37bf73343adb93920a7ae80260b0e57684551e",
            "use": "sig",
            "kty": "RSA",
            // ...
        }
    ]
}
```

3. Use the first key and extract the public key out of it. To do so, you can use tools like https://github.com/Brightspace/node-jwk-to-pem. Something like this would be the basic example:
```js
const JWK_KEY = getJwkKeySomehow(); // as described above
const ID_TOKEN = getIdTokenSomehow();
try {
    jwt.verify(ID_TOKEN, jwkToPem(JWK_KEY), { algorithms: ["RS256"] });
} catch (ex) {
    // Cannot verify the token...
}
```
Libraries like https://www.npmjs.com/package/jwks-rsa can be used to automate this process.

### Notes about jwt.io
People often use https://jwt.io/ to generate and validate tokens. However, it seems that the RS256 signature verification feature expects you to paste `x.509` formatted public key or certificate and does not work with PEM-encoded PKCS#1 public keys. For that reason, if you want to manually verify your token at https://jwt.io/, you will need to provide the original x.509 version of the public key that you can find at the `/public_key` endpoint of the server.
