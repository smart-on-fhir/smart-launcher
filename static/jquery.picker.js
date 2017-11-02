(function($, undefined) {

    // private helpers ---------------------------------------------------------
    function renderMenu(props) {
        if (!Array.isArray(props.data.entry) || !props.data.entry.length) {
            return ('<li class="text-center text-danger">No Providers Found</li>');
        }
        var values = String(props.value || "").trim().split(/\s*,\s*/);
        return $.map(props.data.entry, function(o) {
            if ("name" in o.resource) {
                return (
                    '<li>' +
                        '<a href="javascript: void 0" data-id="' + o.resource.id + '">' +
                            '<span class="text-muted pull-right">' +
                                '<b>ID: </b>' + o.resource.id +
                            '</span>' +
                            '<input type="checkbox" value="' + o.resource.id + '"' +
                            (values.indexOf(o.resource.id) > -1 ? " checked" : "") +
                            ' /> <b>&nbsp;' +
                            Lib.humanName(o.resource) + '</b>' +
                        '</a>' + 
                    '</li>'
                );
            }
            return "";
        }).join("")
    }

    // Picker class ------------------------------------------------------------
    function Picker(input, options) {
        this.options = $.extend({}, options);
        this.init(input, options);
    }

    Picker.prototype.onTextChange = function() {
        var ids = $.trim(this._input.val()).split(/\s*,\s*/);
        this._menu.find(":checkbox").each(function(i, cb) {
            cb.checked = ids.indexOf(this.value) > -1;
        });
    };

    Picker.prototype.init = function(input, options) {
        var input = this._input = $(input);
        input.wrap('<div class="input-group">');
        input.parent().wrap('<div class="dropdown"/>');
        var wrapper = this._wrapper = input.closest(".dropdown");

        input.parent().append(
            '<span class="input-group-btn">' +
                '<button class="btn btn-default" type="button">' +
                '<span class="caret"></span></button>' +
            '</span>'
        );

        var menu = this._menu = $('<ul class="dropdown-menu"></ul>');
        menu.appendTo(wrapper);

        wrapper.on("focus", 'button', this.onFocus.bind(this));
        input.on("focus", this.onFocus.bind(this));
        wrapper.on("blur", 'button', this.onBlur.bind(this));
        input.on("blur", this.onBlur.bind(this));
        menu.on("mousedown", "a[data-id]", this.onOptionMouseDown.bind(this));
        menu.on("click", "a[data-id]", this.onOptionClick.bind(this));
        input.on("input change", this.onTextChange.bind(this));
    };

    Picker.prototype.setValue = function(value) {
        this._input.val(value);
    };

    Picker.prototype.load = function() {
        var inst    = this;
        var menu    = this._menu.html('<li><a>Loading...</a></li>');
        var value   = this._input.val();
        var options = this.options;
        var url     = options.url;
        if (typeof url == "function") {
            url = url();
        }
        $.ajax({
            url: url
        }).then(function(data) {
            inst.data = data;
            menu.html(renderMenu({
                data : data,
                value: value
            }));
        });
    };

    Picker.prototype.onFocus = function() {
        if (this._menu.is(":empty")) {
            this.load();
        }
        this._wrapper.addClass("open");
    };

    Picker.prototype.onBlur = function() {
        this._wrapper.removeClass("open");
    };

    Picker.prototype.onOptionClick = function(e) {
        e.preventDefault();
    };

    Picker.prototype.onOptionMouseDown = function(e) {        
        var inst   = this;
        var oldVal = this._input.val();
        var newVal = $(e.target).closest("a[data-id]").data("id");
        var values = String(oldVal || "").trim().split(/\s*,\s*/);
        var idx    = values.indexOf(newVal);

        e.preventDefault();

        if (idx == -1) {
            values.push(newVal);
        }
        else {
            values.splice(idx, 1);
        }
        newVal = values.filter(Boolean).join(",");
        this.setValue(newVal);
        inst._menu.html(renderMenu({
            data : inst.data,
            value: newVal
        }));
        typeof this.options.onChange == "function" && this.options.onChange(
            newVal,
            oldVal    
        );
    };

    // Picker plugin -----------------------------------------------------------
    $.fn.picker = function(options) {
        return this.each(function() {
            var input = $(this);
            if (!input.is("input")) {
                return;
            }
            input.data("picker", new Picker(this, options));
            return this;
        });
    };

})(jQuery);
