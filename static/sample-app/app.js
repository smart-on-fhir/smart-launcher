var ScopeSet = (function () {
    function ScopeSet(str) {
        if (str === void 0) { str = ""; }
        this.set(str);
    }
    ScopeSet.prototype.set = function (scopesString) {
        if (scopesString === void 0) { scopesString = ""; }
        this._scopesString = String(scopesString).trim();
        this._scopes = this._scopesString.split(/\s+/).filter(Boolean);
    };
    ScopeSet.prototype.has = function (scope) {
        return this._scopes.indexOf(scope) > -1;
    };
    ScopeSet.prototype.matches = function (scopeRegExp) {
        return this._scopesString.search(scopeRegExp) > -1;
    };
    ScopeSet.prototype.add = function (scope) {
        if (this.has(scope)) {
            return false;
        }
        this._scopes.push(scope);
        this._scopesString = this._scopes.join(" ");
        return true;
    };
    ScopeSet.prototype.remove = function (scope) {
        var index = this._scopes.indexOf(scope);
        if (index < 0) {
            return false;
        }
        this._scopes.splice(index, 1);
        this._scopesString = this._scopes.join(" ");
        return true;
    };
    ScopeSet.prototype.toString = function () {
        return this._scopesString;
    };
    ScopeSet.prototype.toJSON = function () {
        return this._scopes;
    };
    return ScopeSet;
}());
function decodeToken(token) {
    return String(token || "").split(".").map(function (data) {
        try {
            return JSON.parse(atob(data));
        }
        catch (ex) {
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
$.fn.showPanel = function (classNames) {
    return this.each(function () {
        var $el = $(this).closest(".panel");
        if (classNames)
            $el.addClass(classNames);
        $el.css("display", "flex");
    });
};
var App = (function () {
    function App(options) {
        this.options = options;
        this.query = Lib.getUrlQuery();
        this.scope = new ScopeSet(this.query.scope || this.options.scope || "");
        this.onAuthReady = this.onAuthReady.bind(this);
        this.onAuthError = this.onAuthError.bind(this);
    }
    App.prototype.loadResource = function (client, type, id, container) {
        if (type && id) {
            return client.api.read({ type: type, id: id }).then(function (result) { return renderJSON(container, result.data); }, function (result) {
                container.text(result.error.responseJSON ?
                    stringify(result.error.responseJSON) :
                    result.error.responseText)
                    .prepend('<b class="error">' +
                    result.error.status + " " +
                    result.error.statusText +
                    "<br/></b>")
                    .showPanel("has-error");
            });
        }
    };
    App.prototype.loadPatient = function (client) {
        if (this.options.patient.hidden === true) {
            return;
        }
        if (!client.patient) {
            if (this.options.patient.hidden === "auto") {
                return;
            }
            $(".patient").text("No patient in context").showPanel();
            return;
        }
        if (!this.scope.has("patient/*.read") &&
            !this.scope.has("patient/*.*")) {
            if (this.options.patient.hidden === "auto") {
                return;
            }
            $(".patient").text("No patient read access requested in scopes")
                .showPanel("has-error");
        }
        else {
            this.loadResource(client, "Patient", client.patient.id, $(".patient"));
        }
    };
    App.prototype.loadEncounter = function (client) {
        if (this.options.encounter.hidden === true) {
            return;
        }
        if (!client.patient) {
            if (this.options.encounter.hidden === "auto") {
                return;
            }
            $(".encounter").text("No patient in context").showPanel();
            return;
        }
        if (!client.tokenResponse.encounter) {
            if (this.options.encounter.hidden === "auto") {
                return;
            }
            $(".encounter").text("No encounter in context").showPanel();
        }
        if (this.scope.has("patient/Encounter.read") ||
            this.scope.has("patient/Encounter.*") ||
            this.scope.has("patient/*.read") ||
            this.scope.has("patient/*.*")) {
            this.loadResource(client, "Encounter", client.tokenResponse.encounter, $(".encounter"));
        }
        else {
            if (this.options.encounter.hidden === "auto") {
                return;
            }
            $(".encounter").text("No encounter read access requested in scopes")
                .showPanel();
        }
    };
    App.prototype.loadUser = function (client) {
        var tokens = String(client.userId || "").split("/");
        $(".page-header-details").text("Loaded by " + tokens[0] + (client.tokenResponse.scope.search(/(^|\s)launch($|\s)/) > -1 ?
            " in EHR" :
            "") + (top === self ? "" : " frame"));
        if (this.options.user.hidden !== true) {
            if (tokens.length == 2) {
                if (this.scope.has("user/*.read") ||
                    this.scope.has("user/*.*")) {
                    this.loadResource(client, tokens[0], tokens[1], $(".user"));
                }
                else {
                    $(".user").text("No user read access requested in scopes")
                        .showPanel();
                }
            }
            else if (this.options.user.hidden === false) {
                $(".user").text("No user in context")
                    .showPanel();
            }
        }
    };
    App.prototype.initStandaloneLaunch = function (fhirServer) {
        sessionStorage.standaloneLaunch = fhirServer;
        this.renderScopes();
        var scope = this.scope.toString();
        if (scope) {
            if (this.query.start) {
                FHIR.oauth2.authorize({
                    client: {
                        client_id: "my_web_app",
                        scope: scope
                    },
                    server: fhirServer
                });
            }
            else {
                $("#aud").focus();
            }
        }
    };
    App.prototype.reLaunch = function () {
        var aud = encodeURIComponent($.trim($("#aud").val()));
        var scope = this.getScopesFromForm();
        if (aud && scope) {
            var url = location.href.split("?").shift();
            $(".standalone-launch-options").parent().hide();
            url += "?aud=" + aud + "&scope=" + scope + "&start=1";
            location.href = url;
        }
    };
    App.prototype.getScopesFromForm = function () {
        var scope = $(":checkbox[name=scope]:checked").get().map(function (cb) {
            return cb.getAttribute("value");
        });
        var custom = $.trim($('[name="custom_scope"]').val());
        if (custom) {
            custom.split(/\s+/).forEach(function (s) {
                if (scope.indexOf(s) == -1) {
                    scope.push(s);
                }
            });
        }
        return encodeURIComponent(scope.filter(Boolean).join(" "));
    };
    App.prototype.renderGlobalError = function (message) {
        if (message === void 0) { message = ""; }
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
    };
    App.prototype.renderScopes = function () {
        if (sessionStorage.standaloneLaunch) {
            $(".standalone-launch-options").show().parent().show();
            $("#aud").val(sessionStorage.standaloneLaunch);
            var custom_1 = [];
            $(':checkbox[name="scope"]').prop("checked", false);
            this.scope.toJSON().forEach(function (s) {
                var cb = $(':checkbox[name="scope"][value="' + s + '"]');
                if (cb.length) {
                    cb.prop("checked", true);
                }
                else {
                    custom_1.push(s);
                }
            });
            $('[name="custom_scope"]').val(custom_1.join(" "));
        }
    };
    App.prototype.renderTokenResponse = function (client) {
        renderJSON($(".token-response"), client.tokenResponse);
    };
    App.prototype.renderToken = function (client, type) {
        var token = client.tokenResponse[type];
        var pre = $("." + type);
        var options = this.options[type];
        var decode = ("decode_" + type in this.query) ?
            this.query["decode_" + type] != "0" :
            !!options.decode;
        if (token) {
            if (decode) {
                try {
                    pre.addClass("has-success").text(decodeToken(token).map(stringify).join("\n.\n"));
                    monaco.editor.colorizeElement(pre[0]);
                }
                catch (ex) {
                    pre.text("Invalid " + type).closest("panel").addClass("has-error");
                }
            }
            else {
                pre.text(client.tokenResponse[type]).addClass("wrap");
            }
            if (options.hidden !== true) {
                pre.showPanel();
            }
        }
        else {
            if (options.hidden === false) {
                pre.text("No " + type + " found in the authorization response")
                    .showPanel();
            }
        }
    };
    App.prototype.renderRefreshButton = function (client) {
        var _this = this;
        if (client.tokenResponse.refresh_token) {
            $(".refresh").css("display", "inline-block").off().on("click", function (e) {
                e.preventDefault();
                $(".auth-errors").hide();
                $.ajax({
                    url: client.server.serviceUrl.replace(/fhir$/, "auth/token"),
                    method: "POST",
                    data: {
                        grant_type: "refresh_token",
                        refresh_token: client.tokenResponse.refresh_token,
                        client_id: client.tokenResponse.client_id,
                        scope: _this.getScopesFromForm() || client.tokenResponse.scope
                    }
                })
                    .then(function (tokenResponse) {
                    $.extend(true, client.tokenResponse, tokenResponse);
                    _this.onAuthReady(client);
                }, _this.onAuthError);
            });
        }
    };
    App.prototype.onAuthReady = function (client) {
        console.log("SMART Ready: ", client);
        $(".page-header").toggleClass("no-logo", client.tokenResponse.need_patient_banner === false);
        this.renderRefreshButton(client);
        this.scope.set(client.tokenResponse.scope);
        this.renderScopes();
        this.renderTokenResponse(client);
        this.renderToken(client, "id_token");
        this.renderToken(client, "refresh_token");
        this.loadUser(client);
        this.loadPatient(client);
        this.loadEncounter(client);
    };
    App.prototype.onAuthError = function (xhr) {
        this.renderGlobalError(xhr.responseText);
    };
    App.prototype.setScopes = function (scopes) {
        this.scope.set(scopes);
    };
    App.prototype.addScope = function (scope) {
        this.scope.add(scope);
    };
    App.prototype.removeScope = function (scope) {
        this.scope.remove(scope);
    };
    App.prototype.init = function () {
        var _this = this;
        $("#launch-form").on("submit", function (e) {
            e.preventDefault();
            _this.reLaunch();
        });
        if (this.renderGlobalError()) {
            return;
        }
        if (this.query.aud) {
            return this.initStandaloneLaunch(this.query.aud);
        }
        $(".content").css("display", "flex");
        require.config({ paths: { 'vs': '/vendor/monaco-editor/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            FHIR.oauth2.ready(_this.onAuthReady, _this.onAuthError);
        });
    };
    return App;
}());
$(function () {
    var app = new App({
        id_token: {
            hidden: false,
            decode: true
        },
        refresh_token: {
            hidden: false,
            decode: false
        },
        user: {
            hidden: false
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
