/**
 * @author Dominik Müller (Ashura) ashura@aimei.ch
 */

"use strict";

/** @namespace $.snackbar */
var App = {
    init: function() {
        $.material.init({"checkbox": false, "radio": false, "validate": false, "toggleButton": false});
        $('body').popover({'trigger': 'hover', 'selector': '[data-toggle="popover"]', 'html': true});
        if (typeof $.snackbar === 'function') {
            this.enivironment.snackable = true;
            this.baseSnack              = {"timeout": 3000, "style": "snack"}
        }
        if (typeof Scheduler !== 'undefined') {
            Scheduler.init()
        }
        var $calendar = $('#calendar');
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
                    Scheduler.load(Scheduler.types.schedules, start.isoWeek() + '-' + start.year(), function(events) {
                        return callback(events);
                    });
                },
                'eventRender':     function(event, element) {
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
        $calendar.fullCalendar('refetchEvents');


    },

    boot: function() {
        $('.bootable.boot-start').each(function(index) {
            var that = this;
            setTimeout(function() {
                $(that).addClass('boot').addClass('booted');
            }, 400 * index);
        });
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
