'use strict';

var keys = [];
var events = {};

var registerEvent = function (name, listener) {
    events[name] = listener;
};

var triggerEvent = function (name, data) {
    return events[name](data);
};

window.addEventListener('keydown', function keysPressed (e) {
    e = e || window.event;
    keys[e.which || e.keyCode] = true;

    switch(e.which || e.keyCode) {
        // Left arrow
        case 37:
            triggerEvent('arrowLeft', e);
            break;

        // Right arrow
        case 39:
            triggerEvent('arrowRight', e);
            break;

        default: return;
    }
});

window.addEventListener('keyup', function keysReleased (e) {
    keys[e.keyCode] = false;
});

module.exports = {
    on: registerEvent
};
