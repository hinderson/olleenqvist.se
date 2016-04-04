/*! Image Zoom - v1
 *  Copyright (c) 2016 Mattias Hinderson
 *  License: MIT
 */

(function(window, document, undefined) {
    'use strict';

    // Constants
    var OFFSET = 60;

    // Cached values
    var cache = {
        ticking: false,
        lastScrollY: window.pageYOffset,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
    };


    // Event emitter
    var eventContainer = {};

    function on (event, callback) {
        if (!eventContainer.hasOwnProperty(event)) {
            eventContainer[event] = [];
        }
        eventContainer[event].push(callback);
    }

    function emit (event, data) {
        if (eventContainer.hasOwnProperty(event)) {
            eventContainer[event].forEach(function(callback) {
                return data ? callback(data) : callback();
            });
        }
    }


    // UTILITIES
    var forEach = function (array, callback, scope) {
		for (var i = 0, len = array.length; i < len; i++) {
			callback.call(scope, i, array[i]);
		}
	};

    var whichTransitionEvent = function ( ) {
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
    };

    var requestAnimFrame = (
		window.requestAnimationFrame        ||
		window.webkitRequestAnimationFrame  ||
		window.mozRequestAnimationFrame     ||
		window.oRequestAnimationFrame       ||
		window.msRequestAnimationFrame      ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	);

    var debounce = function (func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = window.setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};


    // Document events
    var resizeEvent = debounce(function ( ) {
    	cache.viewportWidth = window.innerWidth;
    	cache.viewportHeight = window.innerHeight;
        cache.lastScrollY = window.pageYOffset;
    }, 250);

    var scrollEvent = function ( ) {
    	var requestTick = function ( ) {
            cache.lastScrollY = window.pageYOffset;

    		// Stop ticking
    		cache.ticking = false;
    	};

    	if (!cache.ticking) {
    		requestAnimFrame.call(window, requestTick);
    		cache.ticking = true;
    	}
    };

    window.addEventListener('resize', resizeEvent);
    window.addEventListener('scroll', scrollEvent);


    function calculateZoom (imageRect, thumbRect) {
        var highResImageWidth = imageRect.width;
        var highResImageHeight = imageRect.height;

        var viewportHeight = cache.viewportHeight - OFFSET;
        var viewportWidth  = cache.viewportWidth - OFFSET;

        var maxScaleFactor = highResImageWidth / thumbRect.width;

        var imageAspectRatio = thumbRect.width / thumbRect.height;
        var viewPortAspectRatio = viewportWidth / viewportHeight;

        var imgScaleFactor;
        if (highResImageWidth < viewportWidth && highResImageHeight < viewportHeight) {
            imgScaleFactor = maxScaleFactor;
        } else if (imageAspectRatio < viewPortAspectRatio) {
            imgScaleFactor = (viewportHeight / highResImageHeight) * maxScaleFactor;
        } else {
            imgScaleFactor = (viewportWidth / highResImageWidth) * maxScaleFactor;
        }

        return imgScaleFactor;
    }

    function zoomOut (e) {
        if (e) { e.target.removeEventListener('click', zoomOut); }

        var image = (e && e.target.nodeName === 'IMG') ? e.target : document.querySelector('.img-zoom-container img');
        if (!image) { return; }

        emit('zoomOutStart', thumb);

        var transitionEvent = whichTransitionEvent();
        var thumb = document.querySelector('.hidden');

        // Reset transforms
        requestAnimFrame.call(window, function ( ) {
            document.body.classList.remove('zoom-overlay-open');
            image.style.msTransform = '';
            image.style.webkitTransform = '';
            image.style.transform = '';
        });

        // Wait for transition to end
        image.addEventListener(transitionEvent, function resetImage ( ) {
            image.removeEventListener(transitionEvent, resetImage);
            thumb.classList.remove('hidden');

            var container = image.parentNode;
            container.parentNode.removeChild(container);

            emit('zoomOutEnd', thumb);
        });
    }

    function zoomIn (e) {
        e.preventDefault();

        var transitionEvent = whichTransitionEvent();
        var thumb = e.target;
        var thumbLink = e.target.parentNode;
        var thumbRect = thumb.getBoundingClientRect();
        var imageRect = {
            width: thumbLink.getAttribute('data-width'),
            height: thumbLink.getAttribute('data-height'),
        };
        var clone = thumb.cloneNode(true);

        emit('zoomInStart', thumb);

        // Set initial size and placement of clone and remove unneccesary attributes
        requestAnimFrame.call(window, function ( ) {
            clone.removeAttribute('srcset');
            clone.removeAttribute('sizes');
            clone.style.top = (cache.lastScrollY + thumbRect.top) + 'px';
            clone.style.left = thumbRect.left + 'px';
            clone.style.width = thumbRect.width + 'px';
            clone.style.height = thumbRect.height + 'px';
        });

        // Append the clone to a container
        var container = document.createElement('DIV');
        container.className = 'img-zoom-container';
        container.appendChild(clone);

        // Append container to the body
        document.body.appendChild(container);

        // Hide original image
        thumb.classList.add('hidden');

        // Force repaint
        var repaint = clone.offsetWidth;

        // Calculate offset
        var viewportY = cache.viewportHeight / 2;
        var viewportX = cache.viewportWidth / 2;
        var imageCenterY = thumbRect.top + (thumbRect.height / 2);
        var imageCenterX = thumbRect.left + (thumbRect.width / 2);
        var translate = 'translate3d(' + (viewportX - imageCenterX) + 'px, ' + (viewportY - imageCenterY) + 'px, 0)';

        // Calculate scale ratio
        var scale = 'scale(' + calculateZoom(imageRect, thumbRect) + ')';

        // Apply transforms
        requestAnimFrame.call(window, function ( ) {
            document.body.classList.add('zoom-overlay-open');
            clone.style.msTransform = translate + ' ' + scale;
            clone.style.webkitTransform = translate + ' ' + scale;
            clone.style.transform = translate + ' ' + scale;
        });

        // Load high-res image
        clone.src = thumbLink.getAttribute('href');

        // Events
        container.addEventListener('click', zoomOut);
        window.addEventListener('keydown', function keysPressed (e) {
            e = e || window.event;

            if (e.which === 27 || e.keyCode === 27) {
                zoomOut();
                window.removeEventListener('keydown', keysPressed);
            }
        });

        // Wait for transition to end
        clone.addEventListener(transitionEvent, function activateImage ( ) {
            clone.removeEventListener(transitionEvent, activateImage);
            emit('zoomInEnd', thumb);
        });
    }

    function ImageZoom (elems, opts) {
        if (!elems) return;

        // Update default options
        if (opts) {
            OFFSET = opts.offset;
        }

        // Export event emitter
        this.on = on;

        // Attach click event listeners to all provided elems
        forEach(elems, function (index, link) {
            link.addEventListener('click', zoomIn);
        });
    }

    // Expose to interface
	window.ImageZoom = ImageZoom;

	// Expose to interface
	if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS, just export
		module.exports = ImageZoom;
	} else if (typeof define === 'function' && define.amd) {
		// AMD support
		define('ImageZoom', function() { return ImageZoom; } );
	}

})(window, document);
