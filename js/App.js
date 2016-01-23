/**
 * @author Dominik Müller (Ashura) ashura@aimei.ch
 */

"use strict";

/** @namespace $.snackbar */
/**
 *
 * @type {{init: App.init, boot: App.boot, enivironment: {snackable: boolean}, clearCache: App.clearCache, configure: App.configure}}
 */
var App = {
    /**
     * Function which initializes the website with all components configured.
     */
    init: function() {
        // Start material-design
        $.material.init({"checkbox": false, "radio": false, "validate": false, "toggleButton": false});
        // Apply bootstrap popovers
        $('body').popover({'trigger': 'hover', 'selector': '[data-toggle="popover"]', 'html': true});
        // If the snackbar.js framework has been successfully loaded, save update the environment variable.
        if (typeof $.snackbar === 'function') {
            this.enivironment.snackable = true;
            this.baseSnack              = {"timeout": 3000, "style": "snack"}
        }
        // If the Scheduler has been loaded, initialize it.
        if (typeof Scheduler !== 'undefined') {
            Scheduler.init()
        }
        // Initialize the calendar
        var $calendar = $('#calendar');
        // Configure the calendar
        $calendar.fullCalendar(
            {
                'lang':            'de',
                'hiddenDays':      [0, 6],
                'defaultView':     'agendaWeek',
                'timeFormat':      'H:mm',
                'slotLabelFormat': 'H:mm',
                'contentHeight':   'auto',
                'allDaySlot':      false,
                'minTime':         '05:00:00',
                'weekNumbers':     true,
                'header':          false,
                'events':          function(start, end, timezone, callback) {
                    // Load the events with the Scheduler Object.
                    Scheduler.load(Scheduler.types.schedules, start.isoWeek() + '-' + start.year(), function(events) {
                        return callback(events);
                    });
                },
                'eventRender':     function(event, element) {
                    // Set data attributes for bootstrap popovers.
                    element = element.context;
                    element.setAttribute('data-toggle', 'popover');
                    if (event.start.format('dddd') !== 'Freitag' && event.start.format('dddd') !== 'Donnerstag') {
                        element.setAttribute('data-placement', 'right');
                    } else {
                        element.setAttribute('data-placement', 'left');
                    }
                    element.setAttribute('data-container', 'body');
                    element.setAttribute('data-content', event.description);
                }
            }
        );
        // Apply events.
        $calendar.fullCalendar('refetchEvents');


    },

    /**
     * Initiate nice slide-in animation for material-design-paper-like look-and-feel.
     */
    boot: function() {
        $('.bootable.boot-start').each(function(index) {
            var that = this;
            setTimeout(function() {
                $(that).addClass('boot').addClass('booted');
            }, 400 * index);
        });
    },

    /**
     * Defines variables that contain information about the environment.
     */
    enivironment: {
        snackable: false
    },

    /**
     * Clears localStorage and asks user to reload page.
     */
    clearCache: function() {
        localStorage.clear();
        if (this.enivironment.snackable) {
            var snack         = this.baseSnack;
            snack.content     = 'Der Zwischenspeicher wurde gelöscht. <a href="javascript:location.reload();">Neu laden</a>';
            snack.htmlAllowed = true;
            $.snackbar(snack);
        }
    },

    /**
     * If this would be a multi-site application I'd configure it properly. For instance, what JavaScript objects are used on the page.
     * This minimizes computation.
     */
    configure: function() {}
};
