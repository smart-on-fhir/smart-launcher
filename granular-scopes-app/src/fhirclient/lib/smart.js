/* eslint-disable */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.ready = exports.buildTokenRequest = exports.completeAuth = exports.onMessage = exports.isInPopUp = exports.isInFrame = exports.authorize = exports.getSecurityExtensions = exports.fetchWellKnownJson = exports.KEY = void 0;
/* global window */

const lib_1 = require("./lib");

const Client_1 = require("./Client");

const settings_1 = require("./settings");

Object.defineProperty(exports, "KEY", {
  enumerable: true,
  get: function () {
    return settings_1.SMART_KEY;
  }
});
const debug = lib_1.debug.extend("oauth2");

function isBrowser() {
  return typeof window === "object";
}
/**
 * Fetches the well-known json file from the given base URL.
 * Note that the result is cached in memory (until the page is reloaded in the
 * browser) because it might have to be re-used by the client
 * @param baseUrl The base URL of the FHIR server
 */


function fetchWellKnownJson(baseUrl = "/", requestOptions) {
  const url = String(baseUrl).replace(/\/*$/, "/") + ".well-known/smart-configuration";
  return lib_1.getAndCache(url, requestOptions).catch(ex => {
    throw new Error(`Failed to fetch the well-known json "${url}". ${ex.message}`);
  });
}

exports.fetchWellKnownJson = fetchWellKnownJson;
/**
 * Fetch a "WellKnownJson" and extract the SMART endpoints from it
 */

function getSecurityExtensionsFromWellKnownJson(baseUrl = "/", requestOptions) {
  return fetchWellKnownJson(baseUrl, requestOptions).then(meta => {
    if (!meta.authorization_endpoint || !meta.token_endpoint) {
      throw new Error("Invalid wellKnownJson");
    }

    let supportsPost = false;

    if (meta.capabilities.includes('authorize-post')) {
      supportsPost = true;
    }

    return {
      registrationUri: meta.registration_endpoint || "",
      authorizeUri: meta.authorization_endpoint,
      tokenUri: meta.token_endpoint,
      introspectionUri: meta.introspection_endpoint || "",
      codeChallengeMethods: meta.code_challenge_methods_supported,
      supportsPost: supportsPost
    };
  });
}
/**
 * Fetch a `CapabilityStatement` and extract the SMART endpoints from it
 */


function getSecurityExtensionsFromConformanceStatement(baseUrl = "/", requestOptions) {
  return lib_1.fetchConformanceStatement(baseUrl, requestOptions).then(meta => {
    const nsUri = "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris";
    const extensions = (lib_1.getPath(meta || {}, "rest.0.security.extension") || []).filter(e => e.url === nsUri).map(o => o.extension)[0];
    const out = {
      registrationUri: "",
      authorizeUri: "",
      tokenUri: "",
      introspectionUri: "",
      codeChallengeMethods: [],
      supportsPost: false
    }; // TODO(ginoc): once v2 is formalized, will need to add fields here

    if (extensions) {
      extensions.forEach(ext => {
        if (ext.url === "register") {
          out.registrationUri = ext.valueUri;
        }

        if (ext.url === "authorize") {
          out.authorizeUri = ext.valueUri;
        }

        if (ext.url === "token") {
          out.tokenUri = ext.valueUri;
        }
      });
    }

    return out;
  });
}
/**
 * This works similarly to `Promise.any()`. The tasks are objects containing a
 * request promise and it's AbortController. Returns a promise that will be
 * resolved with the return value of the first successful request, or rejected
 * with an aggregate error if all tasks fail. Any requests, other than the first
 * one that succeeds will be aborted.
 */


function any(tasks) {
  const len = tasks.length;
  const errors = [];
  let resolved = false;
  return new Promise((resolve, reject) => {
    function onSuccess(task, result) {
      task.complete = true;

      if (!resolved) {
        resolved = true;
        tasks.forEach(t => {
          if (!t.complete) {
            t.controller.abort();
          }
        });
        resolve(result);
      }
    }

    function onError(error) {
      if (errors.push(error) === len) {
        reject(new Error(errors.map(e => e.message).join("; ")));
      }
    }

    tasks.forEach(t => {
      t.promise.then(result => onSuccess(t, result), onError);
    });
  });
}
/**
 * The maximum length for a code verifier for the best security we can offer.
 * Please note the NOTE section of RFC 7636 § 4.1 - the length must be >= 43,
 * but <= 128, **after** base64 url encoding. This means 32 code verifier bytes
 * encoded will be 43 bytes, or 96 bytes encoded will be 128 bytes. So 96 bytes
 * is the highest valid value that can be used.
 */


const RECOMMENDED_CODE_VERIFIER_LENGTH = 96;
/**
 * Character set to generate code verifier defined in rfc7636.
 */

const PKCE_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
/**
 * Generates a code_verifier and code_challenge, as specified in rfc7636.
 */

function generatePKCECodes() {
  const output = new Uint32Array(RECOMMENDED_CODE_VERIFIER_LENGTH);
  crypto.getRandomValues(output);
  const codeVerifier = base64urlEncode(Array.from(output).map(num => PKCE_CHARSET[num % PKCE_CHARSET.length]).join(''));
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier)).then(buffer => {
    let hash = new Uint8Array(buffer);
    let binary = '';
    let hashLength = hash.byteLength;

    for (let i = 0; i < hashLength; i++) {
      binary += String.fromCharCode(hash[i]);
    }

    return binary;
  }).then(base64urlEncode).then(codeChallenge => ({
    codeChallenge,
    codeVerifier
  }));
}
/**
 * Implements *base64url-encode* (RFC 4648 § 5) without padding, which is NOT
 * the same as regular base64 encoding.
 * @param value string to encode
 */


function base64urlEncode(value) {
  let base64;

  if (isBrowser()) {
    base64 = btoa(value);
  } else {
    // The "global." makes Webpack understand that it doesn't have to
    // include the Buffer code in the bundle
    return global.Buffer.from(value).toString("base64");
  }

  base64 = base64.replace(/\+/g, '-');
  base64 = base64.replace(/\//g, '_');
  base64 = base64.replace(/=/g, '');
  return base64;
}
/**
 * Given a FHIR server, returns an object with it's Oauth security endpoints
 * that we are interested in. This will try to find the info in both the
 * `CapabilityStatement` and the `.well-known/smart-configuration`. Whatever
 * Arrives first will be used and the other request will be aborted.
 * @param [baseUrl] Fhir server base URL
 * @param [env] The Adapter
 */


function getSecurityExtensions(env, baseUrl = "/") {
  const AbortController = env.getAbortController();
  const abortController1 = new AbortController();
  const abortController2 = new AbortController(); // v2 fields are NOT available via the conformance statement, so ONLY use well-known.

  return any([{
    controller: abortController1,
    promise: getSecurityExtensionsFromWellKnownJson(baseUrl, {
      signal: abortController1.signal
    })
  }]);
  return any([{
    controller: abortController1,
    promise: getSecurityExtensionsFromWellKnownJson(baseUrl, {
      signal: abortController1.signal
    })
  }, {
    controller: abortController2,
    promise: getSecurityExtensionsFromConformanceStatement(baseUrl, {
      signal: abortController2.signal
    })
  }]);
}

exports.getSecurityExtensions = getSecurityExtensions;
/**
 * Starts the SMART Launch Sequence.
 * > **IMPORTANT**:
 *   `authorize()` will end up redirecting you to the authorization server.
 *    This means that you should not add anything to the returned promise chain.
 *    Any code written directly after the authorize() call might not be executed
 *    due to that redirect!
 * @param env
 * @param [params]
 * @param [_noRedirect] If true, resolve with the redirect url without trying to redirect to it
 */

async function authorize(env, params = {}, _noRedirect = false) {
  // Obtain input
  const {
    redirect_uri,
    clientSecret,
    fakeTokenResponse,
    patientId,
    encounterId,
    client_id,
    target,
    width,
    height,
    usePKCE,
    usePost
  } = params;
  let {
    iss,
    launch,
    fhirServiceUrl,
    redirectUri,
    scope = "",
    clientId,
    completeInTarget
  } = params;
  const url = env.getUrl();
  const storage = env.getStorage(); // For these three an url param takes precedence over inline option

  iss = url.searchParams.get("iss") || iss;
  fhirServiceUrl = url.searchParams.get("fhirServiceUrl") || fhirServiceUrl;
  launch = url.searchParams.get("launch") || launch;

  if (!clientId) {
    clientId = client_id;
  }

  if (!redirectUri) {
    redirectUri = redirect_uri;
  }

  if (!redirectUri) {
    redirectUri = env.relative(".");
  } else if (!redirectUri.match(/^https?\:\/\//)) {
    redirectUri = env.relative(redirectUri);
  }

  const serverUrl = String(iss || fhirServiceUrl || ""); // Validate input

  if (!serverUrl) {
    throw new Error("No server url found. It must be specified as `iss` or as " + "`fhirServiceUrl` parameter");
  }

  if (iss) {
    debug("Making %s launch...", launch ? "EHR" : "standalone");
  } // append launch scope if needed


  if (launch && !scope.match(/launch/)) {
    scope += " launch";
  }

  if (isBrowser()) {
    const inFrame = isInFrame();
    const inPopUp = isInPopUp();

    if ((inFrame || inPopUp) && completeInTarget !== true && completeInTarget !== false) {
      // completeInTarget will default to true if authorize is called from
      // within an iframe. This is to avoid issues when the entire app
      // happens to be rendered in an iframe (including in some EHRs),
      // even though that was not how the app developer's intention.
      completeInTarget = inFrame; // In this case we can't always make the best decision so ask devs
      // to be explicit in their configuration.

      console.warn('Your app is being authorized from within an iframe or popup ' + 'window. Please be explicit and provide a "completeInTarget" ' + 'option. Use "true" to complete the authorization in the ' + 'same window, or "false" to try to complete it in the parent ' + 'or the opener window. See http://docs.smarthealthit.org/client-js/api.html');
    }
  } // If `authorize` is called, make sure we clear any previous state (in case
  // this is a re-authorize)


  const oldKey = await storage.get(settings_1.SMART_KEY);
  await storage.unset(oldKey); // create initial state

  const stateKey = lib_1.randomString(16);
  const state = {
    clientId,
    scope,
    redirectUri,
    serverUrl,
    clientSecret,
    tokenResponse: {},
    key: stateKey,
    completeInTarget
  };
  const fullSessionStorageSupport = isBrowser() ? lib_1.getPath(env, "options.fullSessionStorageSupport") : true;

  if (fullSessionStorageSupport) {
    await storage.set(settings_1.SMART_KEY, stateKey);
  } // fakeTokenResponse to override stuff (useful in development)


  if (fakeTokenResponse) {
    Object.assign(state.tokenResponse, fakeTokenResponse);
  } // Fixed patientId (useful in development)


  if (patientId) {
    Object.assign(state.tokenResponse, {
      patient: patientId
    });
  } // Fixed encounterId (useful in development)


  if (encounterId) {
    Object.assign(state.tokenResponse, {
      encounter: encounterId
    });
  }

  let redirectUrl = redirectUri + "?state=" + encodeURIComponent(stateKey); // bypass oauth if fhirServiceUrl is used (but iss takes precedence)

  if (fhirServiceUrl && !iss) {
    debug("Making fake launch...");
    await storage.set(stateKey, state);

    if (_noRedirect) {
      return redirectUrl;
    }

    return await env.redirect(redirectUrl);
  } // Get oauth endpoints and add them to the state


  const extensions = await getSecurityExtensions(env, serverUrl);
  Object.assign(state, extensions);
  await storage.set(stateKey, state); // If this happens to be an open server and there is no authorizeUri

  if (!state.authorizeUri) {
    if (_noRedirect) {
      return redirectUrl;
    }

    return await env.redirect(redirectUrl);
  } // build the redirect uri


  const redirectParams = ["response_type=code", "client_id=" + encodeURIComponent(clientId || ""), "scope=" + encodeURIComponent(scope), "redirect_uri=" + encodeURIComponent(redirectUri), "aud=" + encodeURIComponent(serverUrl), "state=" + encodeURIComponent(stateKey)]; // also pass this in case of EHR launch

  if (launch) {
    redirectParams.push("launch=" + encodeURIComponent(launch));
  } // check if PKCE is requested and supported


  if (usePKCE && extensions.codeChallengeMethods.includes('S256')) {
    let codes = await generatePKCECodes();
    Object.assign(state, codes);
    await storage.set(stateKey, state); // note that the challenge is ALREADY encoded properly

    redirectParams.push("code_challenge=" + state.codeChallenge);
    redirectParams.push("code_challenge_method=S256");
  }

  redirectUrl = state.authorizeUri + "?" + redirectParams.join("&");

  if (_noRedirect) {
    return redirectUrl;
  }

  if (target && isBrowser()) {
    let win;
    win = await lib_1.getTargetWindow(target, width, height);

    if (win !== self) {
      try {
        // Also remove any old state from the target window and then
        // transfer the current state there
        win.sessionStorage.removeItem(oldKey);
        win.sessionStorage.setItem(stateKey, JSON.stringify(state));
      } catch (ex) {
        lib_1.debug(`Failed to modify window.sessionStorage. Perhaps it is from different origin?. Failing back to "_self". %s`, ex);
        win = self;
      }
    }

    if (win !== self) {
      try {
        if (usePost) {
          redirectPost(win, state.authorizeUri, redirectParams);
        } else {
          win.location.href = redirectUrl;
        }

        self.addEventListener("message", onMessage);
      } catch (ex) {
        lib_1.debug(`Failed to modify window.location. Perhaps it is from different origin?. Failing back to "_self". %s`, ex);

        if (usePost) {
          redirectPost(self, state.authorizeUri, redirectParams);
        } else {
          self.location.href = redirectUrl;
        }
      }
    } else {
      if (usePost) {
        redirectPost(self, state.authorizeUri, redirectParams);
      } else {
        self.location.href = redirectUrl;
      }
    }

    return;
  } else {
    if (usePost && isBrowser()) {
      redirectPost(self, state.authorizeUri, redirectParams);
      return;
    }

    return await env.redirect(redirectUrl);
  }
}

exports.authorize = authorize;

function redirectPost(target, url, params) {
  var form = target.document.createElement('form');
  target.document.body.appendChild(form);
  form.method = 'POST';
  form.action = url;
  params.forEach(param => {
    let split = param.split('=');

    if (split.length < 2) {
      return;
    } // skip the name and the '=', but grab the rest as a single string
    // in case there are additional '=' characters in the string


    let value = param.substr(split[0].length + 1);
    var input = target.document.createElement('input');
    input.type = 'hidden';
    input.name = split[0];
    input.value = decodeURIComponent(value);
    form.appendChild(input);
  });
  form.submit();
}
/**
 * Checks if called within a frame. Only works in browsers!
 * If the current window has a `parent` or `top` properties that refer to
 * another window, returns true. If trying to access `top` or `parent` throws an
 * error, returns true. Otherwise returns `false`.
 */


function isInFrame() {
  try {
    return self !== top && parent !== self;
  } catch (e) {
    return true;
  }
}

exports.isInFrame = isInFrame;
/**
 * Checks if called within another window (popup or tab). Only works in browsers!
 * To consider itself called in a new window, this function verifies that:
 * 1. `self === top` (not in frame)
 * 2. `!!opener && opener !== self` The window has an opener
 * 3. `!!window.name` The window has a `name` set
 */

function isInPopUp() {
  try {
    return self === top && !!opener && opener !== self && !!window.name;
  } catch (e) {
    return false;
  }
}

exports.isInPopUp = isInPopUp;
/**
 * Another window can send a "completeAuth" message to this one, making it to
 * navigate to e.data.url
 * @param e The message event
 */

function onMessage(e) {
  if (e.data.type == "completeAuth" && e.origin === new URL(self.location.href).origin) {
    window.removeEventListener("message", onMessage);
    window.location.href = e.data.url;
  }
}

exports.onMessage = onMessage;
/**
 * The completeAuth function should only be called on the page that represents
 * the redirectUri. We typically land there after a redirect from the
 * authorization server..
 */

async function completeAuth(env) {
  var _a, _b;

  const url = env.getUrl();
  const Storage = env.getStorage();
  const params = url.searchParams;
  let key = params.get("state");
  const code = params.get("code");
  const authError = params.get("error");
  const authErrorDescription = params.get("error_description");

  if (!key) {
    key = await Storage.get(settings_1.SMART_KEY);
  } // Start by checking the url for `error` and `error_description` parameters.
  // This happens when the auth server rejects our authorization attempt. In
  // this case it has no other way to tell us what the error was, other than
  // appending these parameters to the redirect url.
  // From client's point of view, this is not very reliable (because we can't
  // know how we have landed on this page - was it a redirect or was it loaded
  // manually). However, if `completeAuth()` is being called, we can assume
  // that the url comes from the auth server (otherwise the app won't work
  // anyway).


  if (authError || authErrorDescription) {
    throw new Error([authError, authErrorDescription].filter(Boolean).join(": "));
  }

  debug("key: %s, code: %s", key, code); // key might be coming from the page url so it might be empty or missing

  if (!key) {
    throw new Error("No 'state' parameter found. Please (re)launch the app.");
  } // Check if we have a previous state


  let state = await Storage.get(key);
  const fullSessionStorageSupport = isBrowser() ? lib_1.getPath(env, "options.fullSessionStorageSupport") : true; // If we are in a popup window or an iframe and the authorization is
  // complete, send the location back to our opener and exit.

  if (isBrowser() && state && !state.completeInTarget) {
    const inFrame = isInFrame();
    const inPopUp = isInPopUp(); // we are about to return to the opener/parent where completeAuth will
    // be called again. In rare cases the opener or parent might also be
    // a frame or popup. Then inFrame or inPopUp will be true but we still
    // have to stop going up the chain. To guard against that weird form of
    // recursion we pass one additional parameter to the url which we later
    // remove.

    if ((inFrame || inPopUp) && !url.searchParams.get("complete")) {
      url.searchParams.set("complete", "1");
      const {
        href,
        origin
      } = url;

      if (inFrame) {
        parent.postMessage({
          type: "completeAuth",
          url: href
        }, origin);
      }

      if (inPopUp) {
        opener.postMessage({
          type: "completeAuth",
          url: href
        }, origin);
        window.close();
      }

      return new Promise(() => {});
    }
  }

  url.searchParams.delete("complete"); // Do we have to remove the `code` and `state` params from the URL?

  const hasState = params.has("state");

  if (isBrowser() && lib_1.getPath(env, "options.replaceBrowserHistory") && (code || hasState)) {
    // `code` is the flag that tell us to request an access token.
    // We have to remove it, otherwise the page will authorize on
    // every load!
    if (code) {
      params.delete("code");
      debug("Removed code parameter from the url.");
    } // If we have `fullSessionStorageSupport` it means we no longer
    // need the `state` key. It will be stored to a well know
    // location - sessionStorage[SMART_KEY]. However, no
    // fullSessionStorageSupport means that this "well know location"
    // might be shared between windows and tabs. In this case we
    // MUST keep the `state` url parameter.


    if (hasState && fullSessionStorageSupport) {
      params.delete("state");
      debug("Removed state parameter from the url.");
    } // If the browser does not support the replaceState method for the
    // History Web API, the "code" parameter cannot be removed. As a
    // consequence, the page will (re)authorize on every load. The
    // workaround is to reload the page to new location without those
    // parameters. If that is not acceptable replaceBrowserHistory
    // should be set to false.


    if (window.history.replaceState) {
      window.history.replaceState({}, "", url.href);
    }
  } // If the state does not exist, it means the page has been loaded directly.


  if (!state) {
    throw new Error("No state found! Please (re)launch the app.");
  } // Assume the client has already completed a token exchange when
  // there is no code (but we have a state) or access token is found in state


  const authorized = !code || ((_a = state.tokenResponse) === null || _a === void 0 ? void 0 : _a.access_token); // If we are authorized already, then this is just a reload.
  // Otherwise, we have to complete the code flow

  if (!authorized && state.tokenUri) {
    if (!code) {
      throw new Error("'code' url parameter is required");
    }

    debug("Preparing to exchange the code for access token...");
    const requestOptions = buildTokenRequest(env, code, state);
    debug("Token request options: %O", requestOptions); // The EHR authorization server SHALL return a JSON structure that
    // includes an access token or a message indicating that the
    // authorization request has been denied.

    const tokenResponse = await lib_1.request(state.tokenUri, requestOptions);
    debug("Token response: %O", tokenResponse);

    if (!tokenResponse.access_token) {
      throw new Error("Failed to obtain access token.");
    } // Now we need to determine when is this authorization going to expire


    state.expiresAt = lib_1.getAccessTokenExpiration(tokenResponse, env); // save the tokenResponse so that we don't have to re-authorize on
    // every page reload

    state = Object.assign(Object.assign({}, state), {
      tokenResponse
    });
    await Storage.set(key, state);
    debug("Authorization successful!");
  } else {
    debug(((_b = state.tokenResponse) === null || _b === void 0 ? void 0 : _b.access_token) ? "Already authorized" : "No authorization needed");
  }

  if (fullSessionStorageSupport) {
    await Storage.set(settings_1.SMART_KEY, key);
  }

  const client = new Client_1.default(env, state);
  debug("Created client instance: %O", client);
  return client;
}

exports.completeAuth = completeAuth;
/**
 * Builds the token request options. Does not make the request, just
 * creates it's configuration and returns it in a Promise.
 */

function buildTokenRequest(env, code, state) {
  const {
    redirectUri,
    clientSecret,
    tokenUri,
    clientId,
    codeVerifier
  } = state;

  if (!redirectUri) {
    throw new Error("Missing state.redirectUri");
  }

  if (!tokenUri) {
    throw new Error("Missing state.tokenUri");
  }

  if (!clientId) {
    throw new Error("Missing state.clientId");
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: `code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}`
  }; // For public apps, authentication is not possible (and thus not required),
  // since a client with no secret cannot prove its identity when it issues a
  // call. (The end-to-end system can still be secure because the client comes
  // from a known, https protected endpoint specified and enforced by the
  // redirect uri.) For confidential apps, an Authorization header using HTTP
  // Basic authentication is required, where the username is the app’s
  // client_id and the password is the app’s client_secret (see example).

  if (clientSecret) {
    requestOptions.headers.Authorization = "Basic " + env.btoa(clientId + ":" + clientSecret);
    debug("Using state.clientSecret to construct the authorization header: %s", requestOptions.headers.Authorization);
  } else {
    debug("No clientSecret found in state. Adding the clientId to the POST body");
    requestOptions.body += `&client_id=${encodeURIComponent(clientId)}`;
  }

  if (codeVerifier) {
    debug("Found state.codeVerifier, adding to the POST body"); // Note that the codeVerifier is ALREADY encoded properly

    requestOptions.body += `&code_verifier=${codeVerifier}`;
  }

  return requestOptions;
}

exports.buildTokenRequest = buildTokenRequest;
/**
 * @param env
 * @param [onSuccess]
 * @param [onError]
 */

async function ready(env, onSuccess, onError) {
  let task = completeAuth(env);

  if (onSuccess) {
    task = task.then(onSuccess);
  }

  if (onError) {
    task = task.catch(onError);
  }

  return task;
}

exports.ready = ready;
/**
 * This function can be used when you want to handle everything in one page
 * (no launch endpoint needed). You can think of it as if it does:
 * ```js
 * authorize(options).then(ready)
 * ```
 *
 * **Be careful with init()!** There are some details you need to be aware of:
 *
 * 1. It will only work if your launch_uri is the same as your redirect_uri.
 *    While this should be valid, we can’t promise that every EHR will allow you
 *    to register client with such settings.
 * 2. Internally, `init()` will be called twice. First it will redirect to the
 *    EHR, then the EHR will redirect back to the page where init() will be
 *    called again to complete the authorization. This is generally fine,
 *    because the returned promise will only be resolved once, after the second
 *    execution, but please also consider the following:
 *    - You should wrap all your app’s code in a function that is only executed
 *      after `init()` resolves!
 *    - Since the page will be loaded twice, you must be careful if your code
 *      has global side effects that can persist between page reloads
 *      (for example writing to localStorage).
 * 3. For standalone launch, only use init in combination with offline_access
 *    scope. Once the access_token expires, if you don’t have a refresh_token
 *    there is no way to re-authorize properly. We detect that and delete the
 *    expired access token, but it still means that the user will have to
 *    refresh the page twice to re-authorize.
 * @param env The adapter
 * @param options The authorize options
 */

async function init(env, options) {
  const url = env.getUrl();
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // if `code` and `state` params are present we need to complete the auth flow

  if (code && state) {
    return completeAuth(env);
  } // Check for existing client state. If state is found, it means a client
  // instance have already been created in this session and we should try to
  // "revive" it.


  const storage = env.getStorage();
  const key = state || (await storage.get(settings_1.SMART_KEY));
  const cached = await storage.get(key);

  if (cached) {
    return new Client_1.default(env, cached);
  } // Otherwise try to launch


  return authorize(env, options).then(() => {
    // `init` promises a Client but that cannot happen in this case. The
    // browser will be redirected (unload the page and be redirected back
    // to it later and the same init function will be called again). On
    // success, authorize will resolve with the redirect url but we don't
    // want to return that from this promise chain because it is not a
    // Client instance. At the same time, if authorize fails, we do want to
    // pass the error to those waiting for a client instance.
    return new Promise(() => {});
  });
}

exports.init = init;