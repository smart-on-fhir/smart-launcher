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
                            '<input type="' + (props.multiple ? "checkbox" : "radio") + '"' +
                            (values.indexOf(o.resource.id) > -1 ? " checked" : "") +
                            ' /> <b>&nbsp;' +
                            Lib.humanName(o.resource) + '</b>' +
                        '</a>' + 
                    '</li>'
                );
            }
            return (
                '<li>' +
                    '<a href="javascript: void 0" data-id="' + o.resource.id + '">' +
                        '<input type="' + (props.multiple ? "checkbox" : "radio") + '"' +
                        (values.indexOf(o.resource.id) > -1 ? " checked" : "") +
                        ' />&nbsp;<span class="text-muted"> Encounter ID: </span>' +
                        o.resource.id +
                    '</a>' + 
                '</li>'
            );
        }).join("")
    }

    // Picker class ------------------------------------------------------------
    function Picker(input, options) {
        this.options = $.extend({}, options);
        this.init(input, options);
    }

    Picker.prototype.init = function(input, options) {
        var input = this._input = $(input);
        input.wrap('<div class="input-group">');
        input.parent().wrap('<div class="dropdown"/>');
        var wrapper = this._wrapper = input.closest(".dropdown");

        input.parent().append(
            '<span class="input-group-btn">' +
                '<button class="btn btn-default" type="button">' +
                'Select <span class="caret"></span></button>' +
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
                data    : data,
                value   : value,
                multiple: options.multiple
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
        var inst = this;
        var oldVal = this._input.val();
        var newVal = $(e.target).closest("a[data-id]").data("id");

        if (this.options.multiple) {
            e.preventDefault();
        }

        if (this.options.multiple) {
            var values = String(oldVal || "").trim().split(/\s*,\s*/);
            var idx = values.indexOf(newVal);
            if (idx == -1) {
                values.push(newVal);
            }
            else {
                values.splice(idx, 1);
            }
            newVal = values.filter(Boolean).join(",");
            this.setValue(newVal);
            inst._menu.html(renderMenu({
                data    : inst.data,
                value   : newVal,
                multiple: inst.options.multiple
            }));
            typeof this.options.onChange == "function" && this.options.onChange(
                newVal,
                oldVal    
            );
        }
        else {
            if (oldVal !== newVal) {
                this.setValue(newVal);
                typeof this.options.onChange == "function" && this.options.onChange(
                    newVal,
                    oldVal    
                );
            }
        }
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
