'use strict';

var utils = {};

utils = {

    requestAnimFrame: (
		window.requestAnimationFrame        ||
		window.webkitRequestAnimationFrame  ||
		window.mozRequestAnimationFrame     ||
		window.msRequestAnimationFrame      ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	),

    forEach: function (array, callback, scope) {
		for (var i = 0, len = array.length; i < len; i++) {
			callback.call(scope, i, array[i]);
		}
	},

    delegate: function (criteria, listener) {
		return function (e) {
			var el = e.target;
			do {
				if (!criteria(el)) continue;
				e.delegateTarget = el;
				listener.apply(this, arguments);
				return;
			} while( (el = el.parentNode) );
		};
	},

	partialDelegate: function (criteria) {
		return function (handler) {
			return utils.delegate(criteria, handler);
		};
	},

	criteria: {
		isAnElement: function (e) {
			return e instanceof HTMLElement;
		},
		hasClass: function (cls) {
			return function (e) {
				return utils.criteria.isAnElement(e) && e.classList.contains(cls);
			};
		},
        hasAttribute: function (attribute) {
            return function (e) {
                return utils.criteria.isAnElement(e) && e.hasAttribute(attribute);
            };
        },
		hasTagName: function (tag) {
			return function (e) {
				return utils.criteria.isAnElement(e) && e.nodeName === tag.toUpperCase();
			};
		},
		hasTagNames: function (tags) {
			if (tags.length > 0) {
				return function (e) {
					for (var i = 0, len = tags.length; i < len; i++) {
						if (utils.criteria.isAnElement(e) && e.nodeName === tags[i].toUpperCase()) {
							return utils.criteria.isAnElement(e) && e.nodeName === tags[i].toUpperCase();
						}
					}
				};
			}
		}
	},

    debounce: function (fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    },

    throttle: function (callback, limit) {
        var wait = false;
        return function ( ) {
            if (!wait) {
                callback.call();
                wait = true;
                setTimeout(function ( ) {
                    wait = false;
                }, limit);
            }
        };
    },

    scrollToPosition: function (destination, duration, callback) {
    	var start = window.pageYOffset;
    	var startTime = 0;
    	var delta = destination - start;

    	// Default easing function
    	function easing (t, b, c, d) {
    		t /= d / 2;
    		if (t < 1) {
    			return c / 2 * t * t * t + b;
    		}
    		t -= 2;
    		return c / 2 * (t * t * t + 2) + b;
    	}

    	function loop (time) {
    		startTime || (startTime = time); // jshint ignore:line
    		var runTime = time - startTime;

    		if (duration > runTime) {
    			utils.requestAnimFrame.call(window, loop);
    			window.scrollTo(0, easing(runTime, start, delta, duration));
    		} else {
    			if (destination !== delta + start) {
    				window.scrollTo(0, delta + start);
    			}
    			if (typeof callback === 'function') {
    				callback(+new Date());
    			}
    		}
    	}

    	utils.requestAnimFrame.call(window, loop);
    },

    scrollToElement: function (element, duration, offset) {
        offset = offset || 0;
    	var rect = element.getBoundingClientRect();
    	var offsetTop = rect.top + window.pageYOffset - offset;

    	utils.scrollToPosition(offsetTop, duration || 500);
    },

    whichTransitionEvent: function ( ) {
        var t, el = document.createElement('fakeelement');

        var transitions = {
            'transition'      : 'transitionend',
            'OTransition'     : 'oTransitionEnd',
            'MozTransition'   : 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (t in transitions){
            if (el.style[t] !== undefined){
              return transitions[t];
            }
        }
    },

    getClosest: function (elem, selector) {
        var firstChar = selector.charAt(0);

        // Get closest match
        for (; elem && elem !== document; elem = elem.parentNode) {
            // If selector is a class
            if (firstChar === '.') {
                if (elem.classList.contains( selector.substr(1))) {
                    return elem;
                }
            }

            // If selector is an ID
            if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    return elem;
                }
            }

            // If selector is a data attribute
            if (firstChar === '[') {
                if (elem.hasAttribute( selector.substr(1, selector.length - 2))) {
                    return elem;
                }
            }

            // If selector is a tag
            if (elem.tagName.toLowerCase() === selector) {
                return elem;
            }
        }

        return false;
    },

    isNodeList: function (nodes) {
        var stringRepr = Object.prototype.toString.call(nodes);

        return typeof nodes === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
            (typeof nodes.length === 'number') &&
            (nodes.length === 0 || (typeof nodes[0] === 'object' && nodes[0].nodeType > 0));
    },

    onSwipe: function (el, callback, reset) {
    	var touchSurface = el;
        var dir;
        var swipeType;
        var startX;
        var startY;
        var dist;
        var distX;
        var distY;
        var threshold = 35;
        var restraint = 100;
        var allowedTime = 500;
        var elapsedTime;
        var startTime;
        var mouseIsDown = false;
        var handleTouch = callback || function (evt, dir, phase, swipetype, distance) { };

        function touchStart (e) {
    		var touchobj = e.changedTouches[0];
    		dir = 'none';
    		swipeType = 'none';
    		dist = 0;
    		startX = touchobj.pageX;
    		startY = touchobj.pageY;
    		startTime = new Date().getTime();
    		handleTouch(e, 'none', 'start', swipeType, 0);
    		e.preventDefault();
    	}

        function touchMove (e) {
    		var touchobj = e.changedTouches[0];
    		distX = touchobj.pageX - startX;
    		distY = touchobj.pageY - startY;
    		if (Math.abs(distX) > Math.abs(distY)) {
    			dir = (distX < 0)? 'left' : 'right';
    			handleTouch(e, dir, 'move', swipeType, distX);
    		} else {
    			dir = (distY < 0)? 'up' : 'down';
    			handleTouch(e, dir, 'move', swipeType, distY);
    		}
    		e.preventDefault();
    	}

        function touchEnd (e) {
            var touchobj = e.changedTouches[0];
            elapsedTime = new Date().getTime() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime) { // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    swipeType = dir;
                } else if (Math.abs(distY) >= threshold  && Math.abs(distX) <= restraint) {
                    swipeType = dir;
                }
            }
            handleTouch(e, dir, 'end', swipeType, (dir =='left' || dir =='right') ? distX : distY);
            e.preventDefault();
        }

        function removeEventListeners (e) {
            touchSurface.removeEventListener('touchstart', touchStart);
            touchSurface.removeEventListener('touchmove', touchMove);
            touchSurface.removeEventListener('touchend', touchEnd);
        }

        // Events
        touchSurface.addEventListener('touchstart', touchStart);
        touchSurface.addEventListener('touchmove', touchMove);
        touchSurface.addEventListener('touchend', touchEnd);
    },

    once: function (element, type, listener, useCapture) {
        function getSelfRemovingHandler (element, type, listener, useCapture) {
            return function selfRemoving ( ) {
            	element.removeEventListener(type, listener, useCapture);
            	element.removeEventListener(type, selfRemoving, useCapture);
            };
        }

        var selfRemoving = getSelfRemovingHandler.apply(null, arguments);
        element.addEventListener(type, listener, useCapture);
        element.addEventListener(type, selfRemoving, useCapture);
        return listener;
    },

    extend: function (defaults, options) {
        var extended = {};
        var prop;
        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    },

};

module.exports = utils;
