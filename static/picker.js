var SmartPicker = (function() {

    var state = {
        skip          : 0,
        searchText    : "",
        mode          : "loading",
        pageSize      : 10,
        sortParam     : "name", 
        sortDir       : "asc",
        apiUrlSegment : "fhir",
        authUrlSegment: "auth/authorize"
    };

    function bindUiEvents() {
        $("#paging-next, #paging-previous").click(handlePagingClick);
        $("th").click(handleHeaderClick);
        $("#search-form").submit(handleSearchSubmit);
        $("table").on("click", ".patient", handlePatientClick);
    }

    function handlePagingClick() {
        var dir = 1;
        if ($(this).attr("id") == "paging-previous") dir = -1;
        state.skip += state.pageSize * dir;
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
        if (state.launchUrl == "") return;

        var patientId = $(this).attr("id").replace("patient-", ""), i, l, pt;
        try {
            for (i = 0, l = state.data.entry.length; i < l; i++) {
                pt = state.data.entry[i];
                if (pt.resource.id === patientId) {
                    parent.setPatient(pt.resource);
                    break;
                }
            }
        } catch(ex) {
            console.error(ex);
        }

        launchApp(patientId);
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        state.searchText = $("#search-text").val();
        loadFhir();
    }

    function buildQueryString(params) {
        var result = [];
        for (var name in params) {
            result.push(name + "=" + encodeURIComponent(String(params[name])));
        }
        return result.join("&");
    }

    function buildFhirUrl() {
        var query = {
            _format : "application/json+fhir",
            _summary: true,
            _count  : state.pageSize
        };

        var sortParam = state.sortParam;
        var sortDir   = state.sortDir;

        if (sortParam == "age") {
            sortParam = "birthdate";
            sortDir   = (sortDir == "asc") ? "desc" : "asc";
        } else if (sortParam == "name") {
            sortParam = "family";
        }

        query["_sort:" + sortDir] = sortParam;

        if (state.patient) {
            query._id = state.patient.replace(/\s*/g, "");
        }

        if (state.searchText) {
            query["name:contains"] = state.searchText;
        }

        return state.aud + "/Patient/?" + buildQueryString(query);
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
                state.mode = "data";
                state.links = getLinks(data);
                render();
            })
            .fail(function() {
                state.mode = "error";
                render();
            });
    }

    function launchApp(patientId) {
        
        var url = window.location.href
            .replace("picker", state.authUrlSegment)
            .replace(/(&?)patient=[^&]*/g, "") + 
            "&patient=" + encodeURIComponent(patientId);

        
        if (state.newWindow == "1") {
            window.open(url);
        } else {
            window.location.href = url;
        }
    }

    function buildPatientRow(patient, tpl, hideButton) {
        return tpl
            .replace("{id}", patient.id)
            .replace("{name}", Lib.humanName(patient))
            .replace("{showButton}", hideButton ? "none" : "inline")
            .replace("{gender}", formatGender(patient))
            .replace("{age}", formatAge(patient))
    }

    function formatAge(patient) {
        if (patient.deceasedBoolean == "true")
            return '<small" class="label label-warning">Deceased</small">';
        
        var dob = patient.birthDate;
        if (!dob) return "";
        
        //fix year or year-month style dates 
        if (/\d{4}$/.test(dob))
            dob = dob + "-01";
        if (/\d{4}-d{2}$/.test(dob))
            dob = dob + "-01"

        var age = moment(dob).from(patient.deceasedDateTime || moment(), true);
        return age.replace("a ", "1 ").replace(/minutes?/, "min") +
            (patient.deceasedDateTime ?
                ' <small" class="label label-warning">Deceased</small">' :
                ""
            );
    }

    function formatGender(patient) {
        var gender = String(patient.gender || "-").charAt(0).toUpperCase();
        if (gender == "M") return '<span class="male">M</span>';
        if (gender == "F") return '<span class="female">F</span>';
        return '<span style="color:#666" title="' + patient.gender + '">' + gender + '</span>';
    }

    function render() {
        function _renderError() {
            if (state.errorMessage) $("#global-error-message").text(message);
            $(".picker").hide();
            $("#global-error").show();
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
            patientRows = $.map(state.data.entry, function(entry) {
                return buildPatientRow(entry.resource, tpl, state.launchUrl == "")
            });
            $(".picker table > tbody").prepend(patientRows.join(""))
            $("#message-loading").hide();
        }

        function _renderPaging() {
            $("#paging-from").text(state.skip + 1);
            $("#paging-to").text(state.skip + state.data.entry.length);
            $("#paging-total").text(state.data.total ? " of " + state.data.total : "");
            $("#paging-next").toggle(!!state.links.next);
            $("#paging-previous").toggle(!!state.links.previous);
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
            state = $.extend(state, config, Lib.getUrlQuery({ camelCaseKeys: true }));
            if (!state.aud) {
                state.aud = location.href.split("?")[0].replace(/\/picker$/, "/fhir");
            }
            bindUiEvents();
            $(".container").show();
            loadFhir();
        }
    }

})();
