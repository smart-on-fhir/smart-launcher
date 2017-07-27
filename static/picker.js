var SmartPicker = (function() {

	/* config params (can be passed to init function or via qs):
		- apiGatewayUrl: FHIR server url for launching app (no default)
		- launchUrl: App's OAuth launch url (no default)
		- limitIds: Comma delimited list of pt ids to limit list - if just one won't show picker (defaults to none)
		- skipPicker: Launch app without a patient - for use in pop health apps (defaults to false)
		- pageSize: Patients shown per page (defaults to 10)
		 "10",
		- newWindow: Launch app in new window (defaults to false)
		- showIds: Show resource id next to pt name. In this mode launching requires clicking the select button. (defaults to false)
		- sortParam: Sort param - name, gender or age (defaults to name)
		- sortDir: Asc or Desc (defaults to asc)  
	*/

	var state = {
		skip: "0",
		searchText: "",
		mode: "loading",
		pageSize: "10",
		sortParam: "name", 
		sortDir: "asc",
	};

	var getQsParams = function() {
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
	var bindUiEvents = function() {
		$("#paging-next, #paging-previous").click(handlePagingClick);
		$("th").click(handleHeaderClick);
		$("#search-form").submit(handleSearchSubmit);
		$("#search-text").focus()
		$("table").on("click", ".patient", handlePatientClick);
	}

	var handlePagingClick = function() {
		var dir = 1;
		if ($(this).attr("id") == "paging-previous")
			dir = -1;
		state.skip = "" + (parseInt(state.skip) + parseInt(state.pageSize) * dir);
		loadFhir(dir == 1 ? state.links.next : state.links.previous)
	}

	var handleHeaderClick = function() {
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

	var handlePatientClick = function(e) {
		if (state.launchUrl == "") return;

		var patientId = $(this).attr("id").replace("patient-", "");
		if (state.showIds != "1" || e.target.tagName == "BUTTON") {
			launchApp(patientId);
		}
	}

	var handleSearchSubmit = function(e) {
		e.preventDefault();
		state.searchText = $("#search-text").val();
		loadFhir();
	}

	// AJAX
	var buildFhirUrl = function() {
		var sortParam = state.sortParam;
		var sortDir = state.sortDir;

		if (sortParam == "age") {
			sortParam = "birthdate"
			sortDir = (sortDir == "asc") ? "desc" : "asc";
		} else if (sortParam == "name") {
			sortParam = "family"
		}

		return state.apiGatewayUrl + 
			"/Patient/?_format=application/json+fhir&_summary=true" +
			"&_count=" + state.pageSize +
			(state.limitIds ? "&_id=" + state.limitIds.replace(/\s*/g, "") : "") + 
			(sortParam ? "&_sort:" + sortDir + "=" + sortParam : "") +
			(state.searchText != "" ? "&name:contains=" + encodeURIComponent(state.searchText) : "");
	}

	var getLinks = function(data) {
		if (!data.link) return {};
		var links = {};
		for (var i=0; i<data.link.length; i++) {
			links[data.link[i].relation] = data.link[i].url;
		};
		return links;
	}

	var loadFhir = function(fhirUrl) {
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
	var launchApp = function(patientId) {
		var launchId = btoa(JSON.stringify({typ:"JWT", alg: "none"})) + "." + btoa(JSON.stringify({
			"patient": patientId,
			"need_patient_banner": true,
			"smart_style_url": "https://gallery-styles.smarthealthit.org/styles/v1.2.12"
		}))  + ".";
		var url = state.launchUrl+"?launch=" +
			encodeURIComponent(launchId)+"&iss=" +
			encodeURIComponent(state.apiGatewayUrl);

		if (state.newWindow == "1") {
			window.open(url);
		} else {
			window.location.href = url;
		}
	}

	// Renderer Helpers
	var buildPatientRow =  function(patient, tpl, showIds, hideButton) {
		return tpl
			.replace("{id}", patient.id)
			.replace("{name}", formatName(patient, showIds))
			.replace("{showButton}", hideButton ? "none" : "inline")
			.replace("{gender}", formatGender(patient))
			.replace("{age}", formatAge(patient))
	}

	var formatAge = function(patient) {
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

	var formatGender = function(patient) {
		var gender = patient.gender || "unknown";
		return gender[0].toUpperCase();
	}

	var formatName = function(patient, showIds) {
		var name = patient.name && patient.name[0];
		if (!name) name = {family: ["No Name Listed"]};

		return (name.family || "") +
			   (name.family && name.given ? ", " : "") +
			   (name.given ? name.given.join(" ") : "") + 
			   (showIds ? " [" + patient.id + "]" :  "")
	}

	// Renderer
	var render = function() {
		var _renderError = function() {
			if (state.errorMessage) $("#global-error-message").text(message);
			$(".picker").hide()
			$("#global-error").show()
		}

		var _renderTableSortIndicators = function() {
			$(".col-sort-ind").hide();
			$("#col-header-" + state.sortParam + " .col-sort-ind-" + state.sortDir).show();	
		}

		var _renderLoading = function() {
			$(".patient").remove();	
			$("#paging, #message-no-patients").hide();
			$("#message-loading").show();
		}

		var _renderNoPatients = function() {
			$("#message-loading").hide();
			$("#message-no-patients").show();
		}

		var _renderPatients = function() {
			var tpl = $("#patient-row-template").html();
			patientRows = _.map(state.data.entry, function(entry) {
				return buildPatientRow(entry.resource, tpl, state.showIds == "1", state.launchUrl == "")
			});
			$(".picker table > tbody").prepend(patientRows.join(""))
			$("#message-loading").hide();
		}

		var _renderPaging = function() {
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
			//pop health - skip picker
			if  (state.skipPicker == "1") {
				launchApp("")
			//single id - launch with it
			} else if (state.limitIds && state.limitIds.indexOf(",") == -1) {
				launchApp(state.limitIds)
			//show picker
			} else {
				bindUiEvents();
				$(".container").show()
				loadFhir();
			}
		}
	}

})();
