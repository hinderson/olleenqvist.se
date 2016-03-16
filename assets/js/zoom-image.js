'use strict';

// Requires
var utils = require('./utils.js');
var pubsub = require('./pubsub.js');

// Constants
var OFFSET = 60;

// Cached values
var cache = {
    lastScrollY: window.pageYOffset,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
};

pubsub.subscribe('resize', function (viewport) {
    cache.viewportWidth = viewport.width;
    cache.viewportHeight = viewport.height;
});

pubsub.subscribe('scroll', function (lastScrollY) {
    cache.lastScrollY = lastScrollY;
});

var calculateZoom = function (imageRect, thumbRect) {
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
};

var zoomOut = function (e) {
    if (e) { e.target.removeEventListener('click', zoomOut); }

    var image = (e && e.target.nodeName === 'IMG') ? e.target : document.querySelector('.img-zoom-container img');
    if (!image) { return; }

    var transitionEvent = utils.whichTransitionEvent();
    var container = image.parentNode;
    var thumb = document.querySelector('.hidden');

    document.body.classList.remove('zoom-overlay-open');

    // Reset transforms
    utils.requestAnimFrame.call(window, function ( ) {
        image.style.msTransform = '';
        image.style.webkitTransform = '';
        image.style.transform = '';
    });

    // Wait for transition to end
    function resetImage ( ) {
        image.removeEventListener(transitionEvent, resetImage);
        thumb.classList.remove('hidden');
        container.parentNode.removeChild(container);
    }

    // Events
    pubsub.publish('zoomedOut', thumb);
    image.addEventListener(transitionEvent, resetImage);
};

var zoomIn = function (e) {
    e.preventDefault();

    var thumb = e.target;
    var thumbLink = e.target.parentNode;
    var thumbRect = thumb.getBoundingClientRect();
    var imageRect = {
        width: thumbLink.getAttribute('data-width'),
        height: thumbLink.getAttribute('data-height'),
    };
    var clone = thumb.cloneNode(true);

    // Set initial size and placement of clone and remove unneccesary attributes
    utils.requestAnimFrame.call(window, function ( ) {
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
    utils.requestAnimFrame.call(window, function ( ) {
        document.body.classList.add('zoom-overlay-open');
        clone.style.msTransform = translate + ' ' + scale;
        clone.style.webkitTransform = translate + ' ' + scale;
        clone.style.transform = translate + ' ' + scale;
    });

    // Load high-res image
    clone.src = thumbLink.getAttribute('href');

    // Events
    pubsub.publish('zoomedIn', thumb);
    container.addEventListener('click', zoomOut);
    window.addEventListener('keydown', function keysPressed (e) {
        e = e || window.event;

        if (e.which === 27 || e.keyCode === 27) {
            zoomOut();
            window.removeEventListener('keydown', keysPressed);
        }
    });
};

module.exports = function (elems) {
    utils.forEach(elems, function (index, link) {
        link.addEventListener('click', zoomIn);
    });
};
