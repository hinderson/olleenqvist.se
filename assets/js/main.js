'use strict';

// Requires
var utils = require('./utils.js');
var pubsub = require('./pubsub.js');
var imagesLoaded = require('imagesloaded');
var Flickity = require('flickity-imagesloaded');
var ImageZoom = require('image-zoom');
var LazyBlur = require('lazyblur');

// States
var collageState = false;
var collapseDisabled = false;
var aboutState = false;

// Cache variables
var cache = {
    ticking: false,
    lastScrollY: null,
    viewportWidth: window.innerWidth,
	viewportHeight: window.innerHeight
};

// Store all breakpoints and fetch the current one
var breakpoint = {
    update: function ( ) {
        this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
    }
};
breakpoint.update();

// Touch action loader
if ('touchAction' in document.body.style) {
    document.body.style.touchAction = 'manipulation';
} else {
    require.ensure(['fastclick'], function (require) {
        var FastClick = require('fastclick');

        window.addEventListener('load', function ( ) {
            FastClick.attach(document.body);
        });
    }, 'fastclick');
}

// Elements
var projectElems = document.querySelectorAll('.project');
var aboutElem = document.querySelector('section.about');
var viewToggler = document.querySelector('.view-toggler button');
var infoToggler = document.querySelector('.info-toggler button');

// Document events
var resizeEvent = utils.debounce(function ( ) {
	cache.viewportWidth = window.innerWidth;
	cache.viewportHeight = window.innerHeight;
    cache.lastScrollY = window.pageYOffset;
    breakpoint.update();

    // Collage state isn't available in mobile view
    if (collageState && breakpoint.value === 'small-viewport') {
        toggleProjectView();
    }

    pubsub.publish('resize', { width: cache.viewportWidth, height: cache.viewportHeight });
}, 250);

var scrollEvent = function ( ) {
	var requestTick = function ( ) {
        cache.lastScrollY = window.pageYOffset;
        pubsub.publish('scroll', cache.lastScrollY);

		// Stop ticking
		cache.ticking = false;
	};

	if (!cache.ticking) {
		utils.requestAnimFrame.call(window, requestTick);
		cache.ticking = true;
	}
};

// Event listeners
window.addEventListener('resize', resizeEvent);
window.addEventListener('scroll', scrollEvent);
viewToggler.addEventListener('click', utils.throttle(toggleProjectView, 300));
infoToggler.addEventListener('click', utils.throttle(toggleInfoView, 300));

var toggleExpandedProject = function (e) {
    if (collapseDisabled) { return; }

    var project = e.target || e;

    project.classList.remove('collapsed');
    project.classList.add('expanded');

    var images = project.querySelectorAll('li');
    utils.forEach(images, function (index, image) {
        utils.requestAnimFrame.call(window, function ( ) {
            image.style.webkitTransform = '';
        });
    });
};

var toggleCollapsedProject = function (e) {
    if (collapseDisabled) { return; }

    var project = e.target || e;

    project.classList.remove('expanded');
    project.classList.add('collapsed');

    function getCoords (min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    utils.forEach(project.querySelectorAll('li'), function (index, image) {
        var posX = 0;
        var posY = 0;

        switch (index) {
            case 0:
                posX = getCoords(10, 45);
                posY = getCoords(20, 45);
                break;
            case 1:
                posX = getCoords(-5, -15);
                posY = getCoords(5, 45);
                break;
            case 2:
                posX = getCoords(-15, -45);
                posY = getCoords(15, 50);
                break;
            case 3:
                posX = getCoords(15, 55);
                posY = getCoords(5, 20);
                break;
            case 4:
                posX = 0;
                posY = 0;
                break;
            case 5:
                posX = getCoords(-15, -55);
                posY = getCoords(5, 20);
                break;
            case 6:
                posX = getCoords(10, 45);
                posY = getCoords(-15, -50);
                break;
            case 7:
                posX = getCoords(-5, -15);
                posY = getCoords(-5, -35);
                break;
            case 8:
                posX = getCoords(-20, -45);
                posY = getCoords(-15, -50);
                break;
        }

        utils.requestAnimFrame.call(window, function ( ) {
            if (index === 4) {
                image.style.webkitTransform = 'translate3d(' + posX + '%, ' + posY + '%, 0) scale(1.1)';
                image.style.position = 'relative';
                image.style.zIndex = 5;
            } else {
                image.style.webkitTransform = 'translate3d(' + posX + '%, ' + posY + '%, 0)';
            }
        });
    });
};

function toggleProjectView (e) {
    viewToggler.querySelector('.label').innerHTML = !collageState ? 'Collage view' : 'List view';

    // Coordinate variables
    var distSum = 0;
    var closest;
    var closestDist;
    var closestElement;

    utils.forEach(projectElems, function (index, project) {
        var projectImages = project.querySelector('.images');

        if (!collageState && breakpoint.value !== 'small-viewport') {
            // Init collage view
            if (project.flkty) {
                project.flkty.destroy();
            }

            toggleCollapsedProject(projectImages);
            projectImages.addEventListener('mouseenter', toggleExpandedProject);
            projectImages.addEventListener('mouseleave', toggleCollapsedProject);
        } else {
            // Init list view
            toggleExpandedProject(projectImages);
            projectImages.removeEventListener('mouseenter', toggleExpandedProject);
            projectImages.removeEventListener('mouseleave', toggleCollapsedProject);

            setTimeout(function ( ) {
                var flkty = project.flkty = new Flickity(projectImages, {
                    cellAlign: 'center',
                    wrapAround: true,
                    percentPosition: true,
                    prevNextButtons: false,
                    pageDots: false,
                    initialIndex: 4, // Always center on the featured image
                    imagesLoaded: true,
                });

                flkty.on('dragStart', function (e) {
                    flkty.slider.classList.add('is-dragging');
                });

                flkty.on('dragEnd', function (e) {
                    flkty.slider.classList.remove('is-dragging');
                });
            }, 300);
        }

        // Save coordinates
        var rect = project.getBoundingClientRect();
        var distance = Math.abs(rect.top);
        if (!closest || closestDist > distance) {
            closest = project;
            closestDist = distance;
            closestElement = project;
        }
        distSum += (rect.height / 2); // Aim for the middle of section
    });

    if (!collageState) {
        document.documentElement.classList.remove('view-list');
        document.documentElement.classList.add('view-collage');
    } else {
        setTimeout(function ( ) {
            document.documentElement.classList.remove('view-collage');
            document.documentElement.classList.add('view-list');

            // Focus on element
            setTimeout(function ( ) {
                utils.scrollToElement(closestElement, 200, cache.viewportHeight * 0.3);
            }, 100);
        }, 305);
    }

    collageState = !collageState;
}

function toggleInfoView ( ) {
    if (!aboutState) {
        aboutElem.setAttribute('aria-hidden', false);
        setTimeout(function ( ) {
            document.body.classList.add('overlay-open');
        }, 5);
    } else {
        aboutElem.setAttribute('aria-hidden', true);
        document.body.classList.remove('overlay-open');
    }

    aboutState = !aboutState;
}

// Initiate zoomable images
var imgZoom = new ImageZoom(document.querySelectorAll('.projects .images a'), {
    offset: 60
});

imgZoom.on('zoomInStart', function ( ) {
    collapseDisabled = true;
    document.body.classList.add('overlay-open');
});

imgZoom.on('zoomOutStart', function ( ) {
    collapseDisabled = false;
    document.body.classList.remove('overlay-open');
});

// Initiate progressive media lazyloader
var lazyBlur = new LazyBlur(document.querySelectorAll('.progressive-media'), {
    blur: 24
});

// Initiate collapsed view
toggleProjectView();
