/**
 * @author Dominik Müller (Ashura) ashura@aimei.ch
 */

"use strict";

var Scheduler = {
    types:             {
        "jobs":      "Berufe",
        "classes":   "Klassen",
        "schedules": "Stundenplan"
    },
    init:              function() {
        var $klasse = $('#klasse');
        var $beruf  = $('#beruf');
        var berufe  = localStorage.getItem('berufe');
        if (berufe !== null && typeof berufe !== 'undefined') {
            berufe = JSON.parse(berufe);
            for (let beruf in berufe) {
                //noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
                $beruf.append('<option value="' + berufe[beruf].beruf_id + '">' + berufe[beruf].beruf_name + '</option>');
            }
            $beruf.removeAttr('disabled');

            var klassen = localStorage.getItem('klassen');
            if (klassen !== null && typeof klassen !== 'undefined') {
                klassen = JSON.parse(klassen);
                for (let klasse in klassen) {
                    //noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
                    $klasse.append('<option value="' + klassen[klasse].klasse_id + '" title="' + klassen[klasse].klasse_longname + '">' + klassen[klasse].klasse_name + '</option>');
                }
            }
        } else {
            this.load(this.types.jobs);
        }
        this.addEventListeners();
        this.restore();
        App.boot();
    },
    restore:           function() {
        var selectedJob = localStorage.getItem('beruf');
        if (selectedJob !== null) {
            var $beruf  = $('#beruf');
            var $klasse = $('#klasse');
            $beruf.val(selectedJob);
            $klasse.parent().parent().show();

            var selectedClass = localStorage.getItem('klasse');
            if (selectedClass !== null) {
                $klasse.val(selectedClass);
                $klasse.removeAttr('disabled');
                $('.scheduler-body').hide();
                $('.filters.panel-heading').addClass('closed');
                $('#calendar-container').addClass('boot-start');
            } else {
                $beruf.trigger('change');
            }
        }
    },
    load:              function(type, data, callback) {
        switch (type) {
            case this.types.jobs:
                $.ajax(
                    {
                        "url":     "http://home.gibm.ch/interfaces/133/berufe.php",
                        "async":   true,
                        "success": function(data) {
                            var $beruf = $('#beruf');
                            localStorage.setItem('berufe', JSON.stringify(data));
                            for (let beruf in data) {
                                //noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
                                $beruf.append('<option value="' + data[beruf].beruf_id + '">' + data[beruf].beruf_name + '</option>');
                            }
                            $beruf.removeAttr('disabled');
                        }
                    }
                );
                break;
            case this.types.classes:
                var jobId = $('#beruf').find('option:selected').attr('value');
                if (typeof jobId === 'undefined') {
                    $('#klasse').parent().parent().slideUp();
                    return;
                }
                $.ajax(
                    {
                        "url":        "http://home.gibm.ch/interfaces/133/klassen.php",
                        'data':       {
                            "beruf_id": jobId
                        },
                        "async":      true,
                        "beforeSend": function() {
                            var $klasse = $('#klasse');
                            $klasse.attr('disabled', 'disabled');
                            $klasse.children().each(function() {
                                if (typeof $(this).attr('value') !== 'undefined') {
                                    $(this).remove();
                                }
                            });
                        },
                        "success":    function(data) {
                            var $klasse = $('#klasse');
                            localStorage.setItem('klassen', JSON.stringify(data));
                            for (let clas in data) {
                                //noinspection JSUnfilteredForInLoop,JSUnresolvedVariable
                                $klasse.append('<option value="' + data[clas].klasse_id + '" title="' + data[clas].klasse_longname + '">' + data[clas].klasse_name + '</option>');
                            }
                            $klasse.removeAttr('disabled');
                            //noinspection JSValidateTypes
                            $klasse.parent().parent().slideDown();
                        }
                    }
                );
                break;
            case this.types.schedules:
                //noinspection JSJQueryEfficiency
                var classId = $('#klasse').find('option:selected').attr('value');
                if (typeof classId === 'undefined') {
                    return;
                }
                $.ajax(
                    {
                        "url":     "http://home.gibm.ch/interfaces/133/tafel.php",
                        'data':    {
                            'klasse_id': classId,
                            'woche':     data
                        },
                        'async':   true,
                        "success": function(data) {
                            var events = [];
                            for (let event in data) {
                                let obj = data[event];
                                event   = {
                                    'date':    obj.tafel_datum,
                                    'weekday': obj.tafel_wochentag,
                                    'from':    obj.tafel_von,
                                    'until':   obj.tafel_bis,
                                    'teacher': obj.tafel_lehrer,
                                    'subject': obj.tafel_longfach,
                                    'room':    obj.tafel_raum,
                                    'comment': (obj.tafel_kommentar ? "<br><br>" + obj.tafel_kommentar : "")

                                };

                                events.push(
                                    {
                                        'title':       event.subject + "\n" + event.room,
                                        'start':       event.date + 'T' + event.from,
                                        'end':         event.date + 'T' + event.until,
                                        'description': event.subject + "<br>" + event.teacher + "<br>" + event.room + event.comment,
                                        'color':       '#FF5722'
                                    }
                                );
                            }


                            return callback(events);
                        }
                    }
                );
                break;
            default:
                console.warn("Type: " + type + " is not in the type definition!");
                break;
        }
    },
    addEventListeners: function() {
        $('#beruf').on('change', function() {
            var selected = $(this).find('option:selected');
            localStorage.removeItem('klasse');
            localStorage.removeItem('klassen');
            if (typeof selected.attr('value') !== 'undefined') {
                localStorage.setItem('beruf', selected.attr('value'));
            } else {
                localStorage.removeItem('beruf');
            }
            $('#calendar-container').removeClass('boot');
            Scheduler.load(Scheduler.types.classes);
        });
        $('#klasse').on('change', function() {
            var selected = $(this).find('option:selected');
            if (typeof selected.attr('value') !== 'undefined') {
                localStorage.setItem('klasse', selected.attr('value'));
            } else {
                localStorage.removeItem('klasse');
                $('#calendar-container').removeClass('boot');
            }
            $('.panel-heading').trigger('click');
            setTimeout(function() {
                $('#calendar-container').addClass('boot').addClass('booted');
            }, 400);
        });
        $('.filters.panel-heading').on('click', function() {
            var that = this;
            var $sb  = $('.scheduler-body');
            if ($sb.is(':visible')) {
                $sb.slideUp(400, function() {
                    $(that).addClass('closed');
                });
            } else {
                $(this).removeClass('closed');
                $sb.slideDown();
            }
        });
    }
};
