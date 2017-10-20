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
        }
    };
    
    var state = Lib.getUrlQuery(); // console.log("State: ", state)


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
                container.addClass("has-error").text(
                    result.error.responseJSON ?
                        JSON.stringify(result.error.responseJSON, null, 4) :
                        result.error.responseText
                )
                .prepend(
                    '<b class="error">' +
                    result.error.status + " " +
                    result.error.statusText +
                    "<br/></b>"
                );
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
        if (CFG.user.hidden !== true) {
            var tokens = String(client.userId || "").split("/");
            if (tokens.length == 2) {
                loadResource(client, tokens[0], tokens[1], $(".user"))
                $(".page-header-details").text(
                    "Loaded by " + tokens[0] + (
                        client.tokenResponse.scope.search(/(^|\s)launch($|\s)/) > -1 ?
                        " in EHR" :
                        ""
                    ) + (
                        top === self ? "" : " frame"
                    )
                );
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
                    pre.addClass("has-error").text("Invalid " + type);
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

        if (state.error || state.error_description) {
            $(".auth-errors").find("> div > div").html(
                [state.error, state.error_description].filter(Boolean).join("<br/>")
            ).end().show();
        }

        else {

            // Standalone launches start here (EHR launches start in launch.html)
            if (state.aud) {
                FHIR.oauth2.authorize({
                    client: {
                        client_id: "whatever",
                        scope: "patient/*.* launch/Patient openid offline_access profile",
                    },
                    server: state.aud
                });
            }

            // We should be here after successful authorization
            else {
                $(".content").css("display", "flex");
                require.config({ paths: { 'vs': '/vendor/monaco-editor/min/vs' }});
                FHIR.oauth2.ready(
                    function(client) {
                        console.log("SMART Ready: ", client);

                        require(['vs/editor/editor.main'], function() {
                            renderToken(client, "id_token")
                            renderToken(client, "refresh_token")

                            $(".token-response").addClass("has-success").text(
                                JSON.stringify(client.tokenResponse, null, 4)
                            );
                            monaco.editor.colorizeElement($(".token-response")[0]);

                            // patient -----------------------------------------
                            if (CFG.patient.hidden !== true) {
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
                            if (CFG.encounter.hidden !== true) {
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