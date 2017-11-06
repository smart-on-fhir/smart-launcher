declare var $, Lib, require, FHIR, monaco;

interface TokenResponse {
    need_patient_banner: boolean;
    smart_style_url: string;
    patient?: string;
    encounter?: string;
    refresh_token?: string;
    token_type: "bearer";
    expires_in: number;
    scope: string;
    client_id: string;
    id_token?: string;
    access_token: string;
    code: string;
    state: string;
}

interface AppOptions {
    scope: string;
    id_token: any;
    refresh_token: any;
    user: any;
    patient: any;
    encounter: any;
}

interface FhirClient {
    userId?: string;
    tokenResponse: TokenResponse;
    patient: any;
}

/**
 * This class tries to make it easier and cleaner to work with scopes (mostly by
 * using the two major methods - "has" and "matches").
 */
class ScopeSet
{
    private _scopesString:string;
    private _scopes:string[];

    public constructor(str = "") {
        this.set(str);
    }

    public set(scopesString = "") {
        this._scopesString = String(scopesString).trim();
        this._scopes = this._scopesString.split(/\s+/).filter(Boolean);
    }

    public has(scope) {
        return this._scopes.indexOf(scope) > -1;
    }

    public matches(scopeRegExp) {
        return this._scopesString.search(scopeRegExp) > -1;
    }

    public add(scope) {
        if (this.has(scope)) {
            return false;
        }

        this._scopes.push(scope);
        this._scopesString = this._scopes.join(" ");
        return true;
    }

    public remove(scope) {
        let index = this._scopes.indexOf(scope);
        if (index < 0) {
            return false;
        }
        this._scopes.splice(index, 1);
        this._scopesString = this._scopes.join(" ");
        return true;
    }

    public toString() {
        return this._scopesString;
    }

    public toJSON() {
        return this._scopes;
    }
}

function decodeToken(token) {
    return String(token || "").split(".").map(data => {
        try {
            return JSON.parse(atob(data));
        }
        catch(ex) {
            return data;
        }
    });
}

function stringify(obj) {
    return JSON.stringify(obj, null, 4);
}

function renderJSON(container, data) {
    container.addClass("has-success").text(stringify(data));
    monaco.editor.colorizeElement(container[0]);
    container.showPanel();
}

/**
 * Very simple jQuery plugin to handle something that would otherwise have to be
 * repeated too many types.
 */
$.fn.showPanel = function(classNames) {
    return this.each(function() {
        let $el = $(this).closest(".panel");
        if (classNames) $el.addClass(classNames);
        $el.css("display", "flex");
    });
};

class App {

    /**
     * The options passed to the app constructor
     */
    private options: AppOptions;

    /**
     * The query string parameter of the page
     */
    private query;

    /**
     * The scopes that the app is currently using
     */
    private scope: ScopeSet;

    /**
     * Loads a resource by type/id using the fhir client
     */
    private loadResource(client, type, id, container): void {
        return client.api.read({ type: type, id: id }).then(
            result => renderJSON(container, result.data),
            result => {
                container.text(
                    result.error.responseJSON ?
                        stringify(result.error.responseJSON) :
                        result.error.responseText
                )
                .prepend(
                    '<b class="error">' +
                    result.error.status + " " +
                    result.error.statusText +
                    "<br/></b>"
                )
                .showPanel("has-error");
            }
        );
    }

    /**
     * Load and render the context encounter if needed
     * @param client
     */
    private loadPatient(client): void {
        if (this.options.patient.hidden === true) {
            return;
        }

        if (!client.patient) {
            if (this.options.patient.hidden === "auto") {
                return; // remain hidden 
            }
            $(".patient").text("No patient in context").showPanel();
            return;
        }

        if (!this.scope.has("patient/*.read") &&
            !this.scope.has("patient/*.*")) {
            if (this.options.patient.hidden === "auto") {
                return; // remain hidden 
            }
            $(".patient").text("No patient read access requested in scopes")
                .showPanel("has-error");
        }
        else {
            this.loadResource(client, "Patient", client.patient.id, $(".patient"));
        }
    }

    /**
     * Load and render the context encounter if needed
     * @param client
     */
    private loadEncounter(client: FhirClient): void {

        // the panel remains hidden
        if (this.options.encounter.hidden === true) {
            return;
        }

        if (!client.patient) {
            if (this.options.encounter.hidden === "auto") {
                return; // remain hidden 
            }
            $(".encounter").text("No patient in context").showPanel();
            return
        }

        if (!client.tokenResponse.encounter) {
            if (this.options.encounter.hidden === "auto") {
                return; // remain hidden 
            }
            $(".encounter").text("No encounter in context").showPanel();
        }

        // Check if we SHOULD load an encounter (otherwise the panel remains hidden).
        // The "encounter.hidden" option must not be true and the app must have
        // requested encounter read access thru scopes
        if (this.scope.has("patient/Encounter.read") ||
            this.scope.has("patient/Encounter.*") || 
            this.scope.has("patient/*.read") ||
            this.scope.has("patient/*.*")) {
            this.loadResource(client, "Encounter", client.tokenResponse.encounter, $(".encounter"));
        }

        else {
            if (this.options.encounter.hidden === "auto") {
                return; // remain hidden 
            }
            $(".encounter").text("No encounter read access requested in scopes")
                .showPanel();
        }
    }
    
    /**
     * Load and render the context user if needed
     * @param client
     */
    private loadUser(client: FhirClient): void {
        var tokens = String(client.userId || "").split("/");

        // Update the "Loaded by ..." text in the header
        $(".page-header-details").text(
            "Loaded by " + tokens[0] + (
                client.tokenResponse.scope.search(/(^|\s)launch($|\s)/) > -1 ?
                " in EHR" :
                ""
            ) + (top === self ? "" : " frame")
        );

        // If the user.hidden equals true the panel remains hidden
        if (this.options.user.hidden !== true) {
            // Valid userId is required and the app must have requested
            // encounter read access through scopes
            if (tokens.length == 2) {

                // need to have read access
                if (this.scope.has("user/*.read") ||
                    this.scope.has("user/*.*")) {
                    this.loadResource(client, tokens[0], tokens[1], $(".user"));
                }

                // need to gain access
                else {
                    $(".user").text("No user read access requested in scopes")
                        .showPanel();
                }
            }
            // otherwise, if options.user.hidden is auto keep the panel hidden.
            // If not - show the "No user in context" message.
            else if (this.options.user.hidden === false) {
                $(".user").text("No user in context")
                    .showPanel();
            }
        }
    }

    /**
     * Initiates a standalone launch
     * @param fhirServer
     */
    private initStandaloneLaunch(fhirServer: string): void {
        
        // Save the standalone launch url so that app can know on subsequent
        // loads if it is in standalone mode and what is the fhir URL.
        sessionStorage.standaloneLaunch = fhirServer;

        let scope = this.scope.toString();
        if (scope) {

            // This wil do a redirect so we are unloading from the window after
            // this call is made!
            FHIR.oauth2.authorize({
                client: {
                    client_id: "my_web_app",
                    scope    : scope
                },
                server: fhirServer
            });
        }
    }

    private reLaunch(): void {
        var aud   = encodeURIComponent($.trim($("#aud").val()));
        var scope = this.getScopesFromForm();

        if (aud && scope) {
            var url = location.href.split("?").shift();
            $(".standalone-launch-options").hide();
            url += "?aud=" + aud + "&scope=" + scope;
            location.assign(url);
        }
    }

    private getScopesFromForm(): string {
        var scope = $(":checkbox[name=scope]:checked").get().map(function(cb) {
            return cb.getAttribute("value")
        });
        
        var custom = $.trim($('[name="custom_scope"]').val());
        if (custom) {
            custom.split(/\s+/).forEach(function(s) {
                if (scope.indexOf(s) == -1) {
                    scope.push(s);
                }
            })
        }

        return encodeURIComponent(scope.filter(Boolean).join(" "));
    }
    
    private renderGlobalError(message: string = ""): boolean {
        if (!message) {
            message = [
                this.query.error,
                this.query.error_description
            ].filter(Boolean).join("<br/>");
        }
        if (message) {
            $(".auth-errors").find("> div > div").html(message).end().show();
            return true;
        }
        return false;
    }

    /**
     * Renders the scopes that the app has received (only relevant for
     * standalone launches)
     */
    private renderScopes() {
        if (sessionStorage.standaloneLaunch) {
            $("#aud").val(sessionStorage.standaloneLaunch);
            let custom = [];
            $(':checkbox[name="scope"]').prop("checked", false);
            this.scope.toJSON().forEach(function(s) {
                var cb = $(':checkbox[name="scope"][value="' + s + '"]');
                if (cb.length) {
                    cb.prop("checked", true);
                }
                else {
                    custom.push(s);
                }
            });
            $('[name="custom_scope"]').val(custom.join(" "));
            $(".standalone-launch-options").show();
        }
    }

    /**
     * Render the token response. This will always happen, regardless of scopes.
     * It will only be skipped if there is an auth error.
     * @param client 
     */
    private renderTokenResponse(client) {
        renderJSON($(".token-response"), client.tokenResponse);
    }

    private renderToken(client, type) {
        const token   = client.tokenResponse[type];
        const pre     = $("." + type);
        const options = this.options[type];
        const decode  = ("decode_" + type in this.query) ?
            this.query["decode_" + type] != "0":
            !!options.decode;
    
        if (token) {
            if (decode) {
                try {
                    pre.addClass("has-success").text(
                        decodeToken(token).map(stringify).join("\n.\n")
                    );
                    monaco.editor.colorizeElement(pre[0]);
                } catch (ex) {
                    pre.text("Invalid " + type).closest("panel").addClass("has-error");
                }
            } else {
                pre.text(client.tokenResponse[type]).addClass("wrap");
            }
            if (options.hidden !== true) {
                pre.showPanel();
            }
        } else {
            if (options.hidden === false) {
                pre.text(`No ${type} found in the authorization response`)
                    .showPanel();
            }
        }
    }

    private renderRefreshButton(client): void {
        if (client.tokenResponse.refresh_token) {
            $("a.refresh").css("display", "inline-block").off().on("click", e => {
                e.preventDefault();
                $(".auth-errors").hide();
                $.ajax({
                    url   : client.server.serviceUrl.replace(/fhir$/, "auth/token"),
                    method: "POST",
                    data: {
                        grant_type   : "refresh_token",
                        refresh_token: client.tokenResponse.refresh_token,
                        client_id    : client.tokenResponse.client_id,
                        scope        : this.getScopesFromForm() || client.tokenResponse.scope
                    }
                })
                .then(
                    tokenResponse => {
                        $.extend(true, client.tokenResponse, tokenResponse);
                        this.onAuthReady(client)
                    },
                    this.onAuthError
                );
            });
        }
    }

    /**
     * This is called by the fhir-client library as a success
     * callback of the FHIR.oauth2.ready function call.
     * @param client The FHIR client object
     */
    private onAuthReady(client: FhirClient) {

        // log the client in the console for those who want to inspect it
        console.log("SMART Ready: ", client);
        
        // We don't have a patient banner to hide but we hide the logo image
        // instead. This way we have a good visual way of showing that the
        // "need_patient_banner" flag works and at the same time we do not
        // duplicate that logo while the app is in the EHR frame.
        $(".page-header").toggleClass(
            "no-logo",
            client.tokenResponse.need_patient_banner === false
        );

        this.renderRefreshButton(client);
        
        // Parse the scopes listed in the authorization response and use that to
        // populate the corresponding form elements and the app's scope object.
        this.scope.set(client.tokenResponse.scope);
        this.renderScopes();

        this.renderTokenResponse(client);
        this.renderToken(client, "id_token");
        this.renderToken(client, "refresh_token");
        this.loadUser(client);
        this.loadPatient(client);
        this.loadEncounter(client);
    }

    private onAuthError(xhr) {
        this.renderGlobalError(xhr.responseText);
    }
    
    public constructor(options: AppOptions) {
        this.options = options;
        this.query = Lib.getUrlQuery();
        this.scope = new ScopeSet(this.query.scope || this.options.scope || "");

        // Event handlers need to bound to the instance
        this.onAuthReady = this.onAuthReady.bind(this);
        this.onAuthError = this.onAuthError.bind(this);
    }

    public setScopes(scopes: string): void {
        this.scope.set(scopes);
    }

    public addScope(scope: string): void {
        this.scope.add(scope);
    }

    public removeScope(scope: string): void {
        this.scope.remove(scope);
    }

    /**
     * This method should be called on DOM ready to initialize the application
     */
    public init() {
        $("a.launch").on("click", e => {
            e.preventDefault();
            this.reLaunch();
        });

        if (this.renderGlobalError()) {
            return;
        }

        if (this.query.aud) {
            return this.initStandaloneLaunch(this.query.aud);
        }

        $(".content").css("display", "flex");

        require.config({ paths: { 'vs': '/vendor/monaco-editor/min/vs' }});
        require(['vs/editor/editor.main'], () => {
            FHIR.oauth2.ready(this.onAuthReady, this.onAuthError);
        });
    }

    
}

////////////////////////////////////////////////////////////////////////////////
$(() => {
    let app = new App({
        id_token: {
            hidden: false,
            decode: true
        },
        refresh_token: {
            hidden: false,
            decode: false
        },
        user: {
            hidden: false // "auto"
        },
        patient: {
            hidden: false
        },
        encounter: {
            hidden: false
        },
        scope: "patient/*.* user/*.* launch/patient launch/encounter openid offline_access profile"
    });

    app.init();
});
