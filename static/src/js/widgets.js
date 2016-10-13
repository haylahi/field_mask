odoo.define('field_mask.form_widgets_manex', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');
var crash_manager = require('web.crash_manager');
var data = require('web.data');
var dom_utils = require('web.dom_utils');
var common = require('web.form_common');
var formats = require('web.formats');
var utils = require('web.utils');

var FieldMask = common.AbstractField.extend(common.ReinitializeFieldMixin, {
    template: 'FieldMask',
    events: {
        'change': 'store_dom_value',
    },
    init: function (field_manager, node) {
        this._super(field_manager, node);
        this.password = this.node.attrs.password === 'True' || this.node.attrs.password === '1';
    },
    initialize_content: function() {
        if(!this.get('effective_readonly') && !this.$input) {
            this.$input = this.$el;
        }
        this.setupFocus(this.$el);
    },
    destroy_content: function() {
        this.$input = undefined;
    },
    store_dom_value: function () {
        if (this.$input && this.is_syntax_valid()) {
            this.internal_set_value(this.parse_value(this.$input.val()));
        }
    },
    commit_value: function () {
        this.store_dom_value();
        return this._super();
    },
    render_value: function() {
        var show_value = this.format_value(this.get('value'), '');
        if (this.$input) {
            this.$input.val(show_value);
             var mask = this.node.attrs.mask;
             this.$input.inputmask(mask);
        } else {
            if (this.password) {
                show_value = new Array(show_value.length + 1).join('*');
            }
            this.$el.text(show_value);
        }
    },
    is_syntax_valid: function() {
        if (this.$input) {
            try {
                this.parse_value(this.$input.val(), '');
            } catch(e) {
                return false;
            }
        }
        return true;
    },
    parse_value: function(val, def) {
        return formats.parse_value(val, this, def);
    },
    format_value: function(val, def) {
        return formats.format_value(val, this, def);
    },
    is_false: function() {
        return this.get('value') === '' || this._super();
    },
    focus: function() {
        if (this.$input) {
            return this.$input.focus();
        }
        return false;
    },

});
core.form_widget_registry
    .add('mask', FieldMask);

return {
    FieldMask: FieldMask
};

});
