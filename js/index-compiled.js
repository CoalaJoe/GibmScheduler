/**
 * @author Dominik Müller (Ashura) ashura@aimei.ch
 */

"use strict";

var scheduler = 'Scheduler';
if (isSafari) {
    scheduler = 'Scheduler-compiled';
}

// Initiate the Application.
requirejs([scheduler], function (Scheduler) {
    requirejs(['App'], function (App) {
        App.init(); // Start application with dependencies
    });
});

//# sourceMappingURL=index-compiled.js.map