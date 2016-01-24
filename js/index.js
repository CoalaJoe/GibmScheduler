/**
 * @author Dominik Müller (Ashura) ashura@aimei.ch
 */

"use strict";


// Initiate the Application.
requirejs(['Scheduler'], function(Scheduler){
    requirejs(['App'], function(App){
        App.init(); // Start application with dependencies
    });
});
