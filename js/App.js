/**
 * @author Dominik Müller (Ashura) ashura@aimei.ch
 */

"use strict";

/** @namespace $.snackbar */
var App = {
    init: function() {
        $.material.init({"checkbox": false, "radio": false, "validate": false, "toggleButton": false});
        if (typeof $.snackbar === 'function') {
            this.enivironment.snackable = true;
            this.baseSnack              = {"timeout": 3000, "style": "snack"}
        }
        if (typeof Scheduler !== 'undefined') {
            Scheduler.init()
        }
    },

    enivironment: {
        snackable: false
    },

    clearCache: function() {
        localStorage.clear();
        if (this.enivironment.snackable) {
            var snack         = this.baseSnack;
            snack.content     = 'Der Zwischenspeicher wurde gelöscht. <a href="javascript:location.reload();">Neu laden</a>';
            snack.htmlAllowed = true;
            $.snackbar(snack);
        }
    },

    configure: function() {}
};
