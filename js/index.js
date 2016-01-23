/**
 * @author Dominik Müller (Ashura) ashura@aimei.ch
 */

"use strict";

App.init();

$('.bootable').each(function(index) {
    var that = this;
    setTimeout(function(){
        console.log(that);
        $(that).addClass('boot');
    }, 400 * index);
});