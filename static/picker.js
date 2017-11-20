var SmartPicker = (function() {

    var state = {
        skip: "0",
        searchText: "",
        mode: "loading",
        pageSize: "10",
        sortParam: "name", 
        sortDir: "asc",
        apiUrlSegment: "fhir",
        authUrlSegment: "auth/authorize"
    };

    function getQsParams() {
        //fix keys with underscores instead of camelcase
        _parseKey = function(key) {
            if (key.indexOf("_") == -1) {
                return key;
            } else {
                return (_.map(key.toLowerCase().split("_"), function(seg, i) {
                    return (i == 0 ? seg[0] : seg[0].toUpperCase()) + seg.slice(1);
                })).join("")
            };
        }
        var query = ((window.location.search).substring(1) || "");
        return _
            .chain(query.split('&'))
            .map(function(params) {
                var p = params.split('=');
                return [_parseKey(p[0]), decodeURIComponent(p[1])];
            }).object().value();
    }

    // UI Event Handlers
    function bindUiEvents() {
        $("#paging-next, #paging-previous").click(handlePagingClick);
        $("th").click(handleHeaderClick);
        $("#search-form").submit(handleSearchSubmit);
        $("#search-text").focus()
        $("table").on("click", ".patient", handlePatientClick);
    }

    function handlePagingClick() {
        var dir = 1;
        if ($(this).attr("id") == "paging-previous")
            dir = -1;
        state.skip = "" + (parseInt(state.skip) + parseInt(state.pageSize) * dir);
        loadFhir(dir == 1 ? state.links.next : state.links.previous)
    }

    function handleHeaderClick() {
        var sortParam = $(this).attr("id").split("-")[2];		
        if (sortParam == state.sortParam) {
            state.sortDir = (state.sortDir == "asc") ? "desc" : "asc";
        } else {
            state.sortDir = "asc"
            state.sortParam = sortParam;
        }
        state.skip = 0;
        loadFhir();
    }

    function handlePatientClick(e) {

        var patientId = $(this).attr("id").replace("patient-", "");
        try {
            parent.postMessage({
                type: 'setPatient',
                data: state.data.entry.find(function(e) {
                    return e.resource.id === patientId
                }).resource
            }, '*');
            // parent.setPatient(state.data.entry.find(function(e) {
            //     return e.resource.id === patientId
            // }).resource);
        } catch(ex) {}

        // if (state.launchUrl == "") return;

        if (state.showIds != "1" || e.target.tagName == "BUTTON") {
            launchApp(patientId);
        }
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        state.searchText = $("#search-text").val();
        loadFhir();
    }

    // AJAX
    function buildFhirUrl() {
        var sortParam = state.sortParam;
        var sortDir = state.sortDir;

        if (sortParam == "age") {
            sortParam = "birthdate"
            sortDir = (sortDir == "asc") ? "desc" : "asc";
        } else if (sortParam == "name") {
            sortParam = "family"
        }

        // return state.apiUrlSegment + 
        return state.aud + 
            "/Patient/?_format=application/json+fhir&_summary=true" +
            "&_count=" + state.pageSize +
            (state.patient ? "&_id=" + state.patient.replace(/\s*/g, "") : "") + 
            (sortParam ? "&_sort:" + sortDir + "=" + sortParam : "") +
            (state.searchText != "" ? "&name:contains=" + encodeURIComponent(state.searchText) : "");
    }

    function getLinks(data) {
        if (!data.link) return {};
        var links = {};
        for (var i=0; i<data.link.length; i++) {
            links[data.link[i].relation] = data.link[i].url;
        };
        return links;
    }

    function loadFhir(fhirUrl) {
        if (!fhirUrl) {
            fhirUrl = buildFhirUrl();
            state.skip = 0;
        }
        state.mode = "loading";
        render();
        $.get(fhirUrl)
            .done( function(data) {
                state.data = data;
                state.mode = "data"
                state.links = getLinks(data);
                render();
            })
            .fail(function() {
                state.mode = "error"
                render();
            });
    }

    // Launcher
    function launchApp(patientId) {
        
        var url = window.location.href
            .replace("picker", state.authUrlSegment)
            .replace(/(&?)patient=[^&]*/g, "") + 
            "&patient=" + window.encodeURIComponent(patientId);

        
        if (state.newWindow == "1") {
            window.open(url);
        } else {
            window.location.href = url;
        }
    }

    // Renderer Helpers
    function buildPatientRow(patient, tpl, showIds, hideButton) {
        return tpl
            .replace("{id}", patient.id)
            .replace("{name}", formatName(patient, showIds))
            .replace("{showButton}", hideButton ? "none" : "inline")
            .replace("{gender}", formatGender(patient))
            .replace("{age}", formatAge(patient))
    }

    function formatAge(patient) {
        var dob = patient.birthDate;
        if (!dob) return "";
        
        //fix year or year-month style dates 
        if (/\d{4}$/.test(dob))
            dob = dob + "-01";
        if (/\d{4}-d{2}$/.test(dob))
            dob = dob + "-01"

        return moment(dob).fromNow(true)
            .replace("a ", "1 ")
            .replace(/minutes?/, "min");
    }

    function formatGender(patient) {
        var gender = patient.gender || "unknown";
        return gender[0].toUpperCase();
    }

    function formatName(patient, showIds) {
        return Lib.humanName(patient) + (showIds ? " [" + patient.id + "]" :  "");
    }

    // Renderer
    function render() {
        function _renderError() {
            if (state.errorMessage) $("#global-error-message").text(message);
            $(".picker").hide()
            $("#global-error").show()
        }

        function _renderTableSortIndicators() {
            $(".col-sort-ind").hide();
            $("#col-header-" + state.sortParam + " .col-sort-ind-" + state.sortDir).show();	
        }

        function _renderLoading() {
            $(".patient").remove();	
            $("#paging, #message-no-patients").hide();
            $("#message-loading").show();
        }

        function _renderNoPatients() {
            $("#message-loading").hide();
            $("#message-no-patients").show();
        }

        function _renderPatients() {
            var tpl = $("#patient-row-template").html();
            patientRows = _.map(state.data.entry, function(entry) {
                return buildPatientRow(entry.resource, tpl, state.showIds == "1", state.launchUrl == "")
            });
            $(".picker table > tbody").prepend(patientRows.join(""))
            $("#message-loading").hide();
        }

        function _renderPaging() {
            $("#paging-from").text(parseInt(state.skip)+1);
            $("#paging-to").text(parseInt(state.skip) + state.data.entry.length);
            $("#paging-total").text(state.data.total);
            $("#paging-next").toggle(state.data.total > parseInt(state.skip) + state.data.entry.length);
            $("#paging-previous").toggle(parseInt(state.skip) > 0);
            $("#paging").show();
        }

        _renderTableSortIndicators();
        if (state.mode == "error") {
            _renderError();
        } else if (state.mode == "loading") {
            _renderLoading();
        } else if (state.data.entry && state.data.entry.length) {
            _renderPatients();
            _renderPaging();
        } else {
            _renderNoPatients();
        }

    }

    return {
        init: function(config) {
            state = _.extend(state, config, getQsParams());
            if (!state.aud) {
                state.aud = location.href.split("?")[0].replace(/\/picker$/, "/fhir");
            }
            bindUiEvents();
            $(".container").show()
            loadFhir();
        }
    }

})();
