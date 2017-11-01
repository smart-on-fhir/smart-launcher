(function() {

    // STU3
    // -----------------------------------------
    // Patient with no encounters: smart-5555003

    var CFG = {
        id_token: {
            hidden: "auto",
            decode: true
        },
        refresh_token: {
            hidden: "auto",
            decode: false
        },
        user: {
            hidden: "auto"
        },
        patient: {
            hidden: "auto"
        },
        encounter: {
            hidden: "auto"
        },
        scope: "patient/*.* user/*.* launch/patient launch/encounter openid offline_access profile"
    };
    
    var state = $.extend({
        scope: CFG.scope
    }, Lib.getUrlQuery()); // console.log("State: ", state)


    function buildStandaloneLaunchUrl() {
        var aud   = encodeURIComponent($.trim($("#aud").val()));
        var scope = getScopesFromForm();

        if (aud && scope) {
            var url = location.href.split("?").shift();
            $(".standalone-launch-options").hide();
            url += "?aud=" + aud + "&scope=" + scope;
            location.assign(url);
        }
    }

    function getScopesFromForm() {
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

    function decodeToken(token) {
        return String(token || "").split(".").map(function(data) {
            try {
                return JSON.parse(atob(data));
            }
            catch(ex) {
                return data;
            }
        });
    }

    function loadResource(client, type, id, container) {
        container.text("Loading " + type + " " + id + "...");
        return client.api.read({
            type: type,
            id: id
        }).then(
            function(result) {
                container.addClass("has-success").text(
                    JSON.stringify(result.data, null, 4)
                );
                monaco.editor.colorizeElement(container[0]);
            },
            function onPatientError(result) {
                container.text(
                    result.error.responseJSON ?
                        JSON.stringify(result.error.responseJSON, null, 4) :
                        result.error.responseText
                )
                .prepend(
                    '<b class="error">' +
                    result.error.status + " " +
                    result.error.statusText +
                    "<br/></b>"
                )
                .closest(".panel")
                .addClass("has-error");
            }
        );
    }

    function loadPatient(client) {
        return loadResource(client, "Patient", client.patient.id, $(".patient"))
    }

    function loadEncounter(client, id) {
        return loadResource(client, "Encounter", id, $(".encounter"))
    }

    function loadUser(client) {
        var tokens = String(client.userId || "").split("/");
        $(".page-header-details").text(
            "Loaded by " + tokens[0] + (
                client.tokenResponse.scope.search(/(^|\s)launch($|\s)/) > -1 ?
                " in EHR" :
                ""
            ) + (
                top === self ? "" : " frame"
            )
        );
        
        if (CFG.user.hidden !== true) {
            
            if (tokens.length == 2 && client.tokenResponse.scope.search(/(^|\s)user\//) > -1) {
                loadResource(client, tokens[0], tokens[1], $(".user"))
            } else {
                if (CFG.user.hidden === false) {
                    $(".user").text("No user in context")
                } else {
                    $(".user").closest(".panel").hide()
                }
            }
        } else {
            $(".user").closest(".panel").hide()
        }
    }

    function renderToken(client, type) {
        var token   = client.tokenResponse[type];
        var pre     = $("." + type);
        var options = CFG[type];
        var decode  = ("decode_" + type in state) ?
            state["decode_" + type] != "0":
            !!options.decode;

        if (token) {
            if (decode) {
                try {
                    var parts = decodeToken(token);
                    pre.addClass("has-success").text(
                        parts.map(function(json) {
                            return JSON.stringify(json, null, 4);
                        }).join("\n.\n")
                    );
                    monaco.editor.colorizeElement(pre[0]);
                } catch (ex) {
                    pre.text("Invalid " + type).closest("panel").addClass("has-error");
                }
            } else {
                pre.text(client.tokenResponse[type]).addClass("wrap");
            }
            if (options.hidden !== true) {
                pre.closest(".panel").css("display", "flex");
            }
        } else {
            if (options.hidden === false) {
                pre.text("No " + type).css("display", "flex");
            }
        }
    }

    $(function() {

        $("a.launch").on("click", function(e) {
            e.preventDefault();
            buildStandaloneLaunchUrl();
        });

        if (state.error || state.error_description) {
            $(".auth-errors").find("> div > div").html(
                [state.error, state.error_description].filter(Boolean).join("<br/>")
            ).end().show();
        }

        else {

            // Standalone launches start here (EHR launches start in launch.html)
            if (state.aud) {
                sessionStorage.standaloneLaunch = state.aud;
                if (state.scope) {
                    FHIR.oauth2.authorize({
                        client: {
                            client_id: "my_web_app",
                            scope: state.scope
                        },
                        server: state.aud
                    });
                }
            }

            // We should be here after successful authorization
            else {
                if (sessionStorage.standaloneLaunch) {
                    $("#aud").val(sessionStorage.standaloneLaunch);
                    $(".standalone-launch-options").show();
                }
                $(".content").css("display", "flex");
                require.config({ paths: { 'vs': '/vendor/monaco-editor/min/vs' }});
                FHIR.oauth2.ready(
                    function onAuthReady(client) {
                        console.log("SMART Ready: ", client);

                        $(".page-header").toggleClass("no-logo", client.tokenResponse.need_patient_banner === false);
                        
                        var scopes = client.tokenResponse.scope.split(" "), custom = [];
                        $(':checkbox[name="scope"]').prop("checked", false);
                        scopes.forEach(function(s) {
                            var cb = $(':checkbox[name="scope"][value="' + s + '"]');
                            if (cb.length) {
                                cb.prop("checked", true);
                            }
                            else {
                                custom.push(s);
                            }
                        });
                        $('[name="custom_scope"]').val(custom.join(" "));
                        

                        require(['vs/editor/editor.main'], function() {
                            renderToken(client, "id_token")
                            renderToken(client, "refresh_token")

                            if (client.tokenResponse.refresh_token) {
                                $("a.refresh").css("display", "inline-block").off().on("click", function(e) {
                                    e.preventDefault();
                                    $(".auth-errors").hide();
                                    $.ajax({
                                        url   : client.server.serviceUrl.replace(/fhir$/, "auth/token"),
                                        method: "POST",
                                        data: {
                                            grant_type   : "refresh_token",
                                            refresh_token: client.tokenResponse.refresh_token,
                                            client_id    : client.tokenResponse.client_id,
                                            scope        : getScopesFromForm() || client.tokenResponse.scope
                                        }
                                    }).then(function(tokenResponse) {
                                        $.extend(true, client.tokenResponse, tokenResponse);
                                        onAuthReady(client)
                                    }, function(xhr) {
                                        // console.log(arguments)
                                        $(".auth-errors").find("> div > div").html(xhr.responseText).end().show();
                                    });
                                });
                            }

                            $(".token-response").addClass("has-success").text(
                                JSON.stringify(client.tokenResponse, null, 4)
                            );
                            monaco.editor.colorizeElement($(".token-response")[0]);

                            // patient -----------------------------------------
                            if (CFG.patient.hidden !== true && client.tokenResponse.scope.indexOf("patient/") > -1) {
                                if (client.patient) {
                                    loadPatient(client).fail(function() {
                                        if (CFG.patient.hidden == "auto") {
                                            $(".patient").closest(".panel").hide();
                                        }
                                    });
                                } else {
                                    if (CFG.patient.hidden == "auto") {
                                        $(".patient").closest(".panel").hide();
                                    } else {
                                        $(".patient").text("No patient in context");
                                    }
                                }
                            } else {
                                $(".patient").closest(".panel").hide();
                            }

                            // encounter ---------------------------------------
                            if (CFG.encounter.hidden !== true && (
                                scopes.indexOf("patient/Encounter.read") > -1 ||
                                scopes.indexOf("patient/Encounter.*") > -1 || 
                                scopes.indexOf("patient/*.read") > -1 ||
                                scopes.indexOf("patient/*.*") > -1
                            )) {
                                if (client.tokenResponse.encounter) {
                                    loadEncounter(client, client.tokenResponse.encounter)
                                    .fail(function() {
                                        if (CFG.encounter.hidden == "auto") {
                                            $(".encounter").closest(".panel").hide();
                                        }
                                    });
                                } else {
                                    if (CFG.encounter.hidden == "auto") {
                                        $(".encounter").closest(".panel").hide();
                                    } else {
                                        $(".encounter").text("No encounter in context");
                                    }
                                }
                            } else {
                                $(".encounter").closest(".panel").hide();
                            }

                            // user --------------------------------------------
                            loadUser(client)
                        });
                    },
                    function(error) {
                        console.log("SMART Error: ", arguments);
                        $(".content").hide();
                        $(".auth-errors").find("> div > div").html(error).end().show();
                    }
                );
            }
        }
    });
})();