'use strict';

// Requires
var utils = require('./utils.js');
var pubsub = require('./pubsub.js');
var keyboard = require('./keyboard-commands.js');
var imagesLoaded = require('imagesloaded');
var Flickity = require('flickity-imagesloaded');
var ImageZoom = require('image-zoom');
var LazyBlur = require('lazyblur');
var FontFaceObserver = require('fontfaceobserver');

// States
var stackState = false;
var uiDisabled = false;
var aboutState = false;

// Cache variables
var cache = {
    ticking: false,
    lastScrollY: null,
    viewportWidth: window.innerWidth,
	viewportHeight: window.innerHeight,
    projectPositions: [],
    closestProject: ''
};

// Elements
var projectElems = document.querySelectorAll('.project');
var aboutElem = document.querySelector('section.about');
var viewToggler = document.querySelector('.view-toggler button');
var infoToggler = document.querySelector('.info-toggler button');

// Store all breakpoints and fetch the current one
var breakpoint = {
    update: function ( ) {
        this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
    }
};

// Store project positions
var storeProjectPositions = function ( ) {
    cache.projectPositions.length = 0;
    utils.forEach(projectElems, function (index, project) {
        var top = Math.floor(project.getBoundingClientRect().top + (cache.lastScrollY || window.pageYOffset));
        cache.projectPositions.push(top);
    });
    highlightVisibleProject(cache.lastScrollY);
};

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

// Wait for fonts to really load to avoid FOIT
var font = new FontFaceObserver('GT Cinetype', {
    weight: 400
});
font.load().then(function () {
    document.documentElement.className += ' fonts-loaded';
});

// Document events
var resizeEvent = utils.debounce(function ( ) {
	cache.viewportWidth = window.innerWidth;
	cache.viewportHeight = window.innerHeight;
    cache.lastScrollY = window.pageYOffset;
    breakpoint.update();

    // Collage state isn't available in mobile view
    if (stackState && breakpoint.value === 'small-viewport') {
        toggleProjectView();
    }

    storeProjectPositions();

    pubsub.publish('resize', { width: cache.viewportWidth, height: cache.viewportHeight });
}, 250);

var scrollEvent = function ( ) {
	var requestTick = function ( ) {
        cache.lastScrollY = window.pageYOffset;
        highlightVisibleProject(cache.lastScrollY);
        pubsub.publish('scroll', cache.lastScrollY);

		// Stop ticking
		cache.ticking = false;
	};

	if (!cache.ticking) {
		utils.requestAnimFrame.call(window, requestTick);
		cache.ticking = true;
	}
};

// Initiate progressive media lazyloader
var lazyBlur = new LazyBlur(document.querySelectorAll('.progressive-media'), {
    blur: 10
});

// Event listeners
window.addEventListener('resize', resizeEvent);
window.addEventListener('scroll', scrollEvent);
viewToggler.addEventListener('click', utils.throttle(toggleProjectView, 300));
infoToggler.addEventListener('click', utils.throttle(toggleInfoView, 300));

var toggleExpandedProject = function (e) {
    if (uiDisabled) { return; }

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
    if (uiDisabled) { return; }

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
            if (index !== 4) {
                image.style.webkitTransform = 'translate3d(' + posX + '%, ' + posY + '%, 0)';
            }
        });
    });
};

function toggleProjectView ( ) {
    viewToggler.querySelector('.label').innerHTML = !stackState ? 'Strip view' : 'Stack view';

    utils.forEach(projectElems, function (index, project) {
        var projectImages = project.querySelector('.images');

        if (!stackState && breakpoint.value !== 'small-viewport') {
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
                    accessibility: false
                });

                flkty.on('dragStart', function (e) {
                    flkty.slider.classList.add('is-dragging');
                });

                flkty.on('dragEnd', function (e) {
                    flkty.slider.classList.remove('is-dragging');
                });

                flkty.on('settle', function ( ) {
                    lazyBlur.check();
                });
            }, 300);
        }
    });

    var closestProject = cache.closestProject;
    if (!stackState) {
        document.documentElement.classList.remove('view-list');
        document.documentElement.classList.add('view-collage');

        lazyBlur.check();
        storeProjectPositions();
    } else {
        setTimeout(function ( ) {
            document.documentElement.classList.remove('view-collage');
            document.documentElement.classList.add('view-list');

            setTimeout(function ( ) {
                lazyBlur.check();
                storeProjectPositions();
                utils.scrollToElement(closestProject, 200, cache.viewportHeight * 0.3);
            }, 100);
        }, 305);
    }

    stackState = !stackState;
}

var keysCloseInfoView = function (e) {
    e = e || window.event;

    if (e.which === 27 || e.keyCode === 27) {
        toggleInfoView();
    }
};

var clickOutsideInfo = function (e) {
    if (e.target.classList.contains('about')) {
        toggleInfoView();
    }
};

function toggleInfoView ( ) {
    if (!aboutState) {
        window.addEventListener('keydown', keysCloseInfoView);
        aboutElem.addEventListener('click', clickOutsideInfo);
        aboutElem.setAttribute('aria-hidden', false);
        setTimeout(function ( ) {
            document.body.classList.add('overlay-open');
        }, 5);
    } else {
        window.removeEventListener('keydown', keysCloseInfoView);
        aboutElem.removeEventListener('click', clickOutsideInfo);
        aboutElem.setAttribute('aria-hidden', true);
        document.body.classList.remove('overlay-open');
    }

    uiDisabled = !uiDisabled;
    aboutState = !aboutState;
}

function highlightVisibleProject (lastScrollY) {
    var viewportHeightPercentage = cache.viewportHeight * 0.5;
    var offset = lastScrollY + viewportHeightPercentage;
    var visibleSections = [];

    cache.projectPositions.forEach(function (pos, index) {
        if (!projectElems[index]) { return; }

        projectElems[index].classList.remove('is-visible');
        if (offset >= pos) {
            visibleSections.push(index);
        }
        if (index > 0) {
            projectElems[index - 1].classList.remove('active');
        }
    });

    var currentIndex = visibleSections[visibleSections.length - 1];
    projectElems[currentIndex].classList.add('is-visible');
    cache.closestProject = projectElems[currentIndex];
}

// Navigate slideshow with keyboard
keyboard.on('arrowRight', function (event) {
    event.preventDefault();

    // Toggle previous slide when in strip view
    if (!stackState && !uiDisabled) {
        var focusedProject = document.querySelector('.is-visible');
        focusedProject.flkty.next();
    }
});

keyboard.on('arrowLeft', function (event) {
    event.preventDefault();

    // Toggle next slide when in strip view
    if (!stackState && !uiDisabled) {
        var focusedProject = document.querySelector('.is-visible');
        focusedProject.flkty.previous();
    }
});

// Initiate zoomable images
if (breakpoint.value !== 'small-viewport') {
    utils.forEach(document.querySelectorAll('.projects .images'), function (index, item) {
        var imgZoom = new ImageZoom(item.querySelectorAll('a'), {
            offset: 60
        });

        imgZoom.on('zoomInStart', function ( ) {
            uiDisabled = true;
            document.body.classList.add('overlay-open');
        });

        imgZoom.on('zoomOutStart', function ( ) {
            uiDisabled = false;
            document.body.classList.remove('overlay-open');
        });
    });
} else {
    // DESTROY
}

breakpoint.update();
storeProjectPositions();
toggleProjectView();
