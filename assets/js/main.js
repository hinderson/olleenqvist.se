'use strict';

// Requires
var utils = require('./utils.js');
var pubsub = require('./pubsub.js');
var VideoEmbed = require('./video-embed.js');
var keyboard = require('./keyboard-commands.js');
var Flickity = require('flickity');
var ImageZoom = require('image-zoom');
var LazyBlur = require('lazyblur');
var Promise = window.Promise = require('promise-polyfill'); // Polyfill promises
var FontFaceObserver = require('fontfaceobserver');

// States
var stackState = false;
var uiDisabled = false;
var aboutState = false;
var isUiTransitioning = false;
var currentCategory = document.body.getAttribute('data-selected-category');
var lazyBlur;

// Cache variables
var cache = {
    ticking: false,
    lastScrollY: null,
    viewportWidth: window.innerWidth,
	viewportHeight: window.innerHeight,
    projectPositions: [],
    closestProject: undefined
};

// Elements
var elems = {
    projects: null,
    siteHeader: document.querySelector('.site-header'),
    projectLinks: null,
    projectsSection: document.querySelector('.section-projects'),
    aboutSection: document.querySelector('.section-about'),
    viewToggler: document.querySelector('.view-toggler'),
    infoToggler: document.querySelector('.info-toggler'),
    categorySwitchers: document.querySelectorAll('.category-switcher a'),
    mediaNav: document.querySelector('.media-nav'),
};

// Store all breakpoints and fetch the current one
var breakpoint = {
    update: function ( ) {
        var previous = this.value;
        var current = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
        this.value = current;

        if (previous !== current) {
            pubsub.publish('breakpointChanged', [previous, current]);
        }
    }
};

// Store project positions
var storeProjectPositions = function ( ) {
    cache.projectPositions.length = 0;
    utils.forEach(elems.projects, function (index, project) {
        var top = Math.floor(project.getBoundingClientRect().top + (cache.lastScrollY || window.pageYOffset));
        cache.projectPositions.push(top);
    });
    highlightVisibleProject(cache.lastScrollY);
};

// Wait for fonts to really load to avoid FOIT
var font = new FontFaceObserver('GT Cinetype');
font.load().then(function () {
    document.documentElement.className += ' fonts-loaded';
});

// Document events
var resizeEvent = utils.debounce(function ( ) {
	cache.viewportWidth = window.innerWidth;
	cache.viewportHeight = window.innerHeight;
    cache.lastScrollY = window.pageYOffset;
    breakpoint.update();

    if (breakpoint.value === 'small-viewport' && stackState) {
        // Collage state isn't available in mobile view
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

function parseVideo (url) {
    var type = '';
    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    if (RegExp.$3.indexOf('youtu') > -1) {
        type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        type = 'vimeo';
    }

    return {
        type: type,
        id: RegExp.$6
    };
}

function makeVideoEmbed (vendor, id) {
    if (vendor !== 'youtube' && vendor !== 'vimeo') return;

    var videoEmbed = document.createElement('IFRAME');
    if (vendor === 'youtube') {
        videoEmbed.setAttribute('src', 'https://www.youtube.com/embed/' + id + '?autoplay=1&showinfo=0&controls=0&rel=0&showinfo=0');
    } else if (vendor === 'vimeo') {
        videoEmbed.setAttribute('src', 'https://player.vimeo.com/video/' + id + '?api=1&title=0&byline=0&portrait=0&autoplay=1');
    }

    videoEmbed.setAttribute('webkitallowfullscreen', '');
    videoEmbed.setAttribute('mozallowfullscreen', '');
    videoEmbed.setAttribute('allowfullscreen', '');
    videoEmbed.setAttribute('frameborder', 0);
    videoEmbed.setAttribute('allow', 'autoplay');

    var container = document.createElement('DIV');
    container.appendChild(videoEmbed);

    return container;
}

// Event listeners
window.addEventListener('resize', resizeEvent);
window.addEventListener('scroll', scrollEvent);
window.addEventListener('orientationchange', resizeEvent);
if (elems.viewToggler) {
    elems.viewToggler.addEventListener('click', toggleProjectView);
}
elems.infoToggler.addEventListener('click', toggleInfoView);
utils.forEach(elems.categorySwitchers, function (index, elem) {
    elem.addEventListener('click', toggleCategoryView);
});

var toggleExpandedProject = function (e, callback) {
    if (uiDisabled) { return; }

    var project = e.target || e;

    project.classList.remove('collapsed');
    project.classList.add('expanded');

    utils.forEach(project.querySelectorAll('li'), function (index, image) {
        image.style.msTransform = '';
        image.style.webkitTransform = '';
        image.style.transform = '';
    });
};

var toggleCollapsedProject = function (e) {
    if (uiDisabled || !e) { return; }

    var project = e.target || e;
    var projectListItems = project.querySelectorAll('li');
    var length = projectListItems.length;

    project.classList.remove('expanded');
    project.classList.add('collapsed');

    function getRandomCoords (min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    var getRows = function (length) {
        if (length > 3 && length < 6) {
            return 2;
        } else if (length > 6) {
            return 3;
        }
        return 1;
    };

    var getPositions = function (index, length) {
        var rows = getRows(length);

        return {
            0: {
                posX: getRandomCoords(10, 45),
                posY: rows === 1 ? getRandomCoords(-15, -20) : getRandomCoords(20, 45),
            },
            1: {
                posX: getRandomCoords(-5, -15),
                posY: rows === 1 ? getRandomCoords(-5, -15) : getRandomCoords(5, 45),
            },
            2: {
                posX: getRandomCoords(-15, -45),
                posY: rows === 1 ? getRandomCoords(-15, -20) : getRandomCoords(15, 50),
            },
            3: {
                posX: getRandomCoords(15, 55),
                posY: getRandomCoords(5, 20),
            },
            4: {
                posX: 0,
                posY: 0,
            },
            5: {
                posX: getRandomCoords(-15, -55),
                posY: getRandomCoords(5, 20),
            },
            6: {
                posX: getRandomCoords(10, 45),
                posY: getRandomCoords(-15, -50),
            },
            7: {
                posX: getRandomCoords(-5, -15),
                posY: getRandomCoords(-5, -35),
            },
            8: {
                posX: getRandomCoords(-20, -45),
                posY: getRandomCoords(-15, -50),
            },
      }[index];
    };

    utils.forEach(projectListItems, function (index, image) {
        var positions = getPositions(index, length);
        var transform = 'translate3d(' + positions.posX + '%, ' + positions.posY + '%, 0)';

        utils.requestAnimFrame.call(window, function ( ) {
            if (index !== 4) {
                image.style.msTransform = transform;
                image.style.webkitTransform = transform;
                image.style.transform = transform;
            }
        });
    });
};

var transitionEvent = utils.whichTransitionEvent();

function toggleCategoryView (event) {
    var category= utils.getQueryString('type', event.target.href);

    function switchCategory () {
        return utils.getJSON('/projects.json?type=' + category).then(function (result) {
            function transitionDone (event) {
                if (event.target === document.body) {
                    isUiTransitioning = false;
                    document.body.classList.remove('is-transitioning');
                    document.body.classList.remove('view-list'); // Hack to get rid of view-list class before the init() is triggered
                    document.body.removeEventListener(transitionEvent, transitionDone);

                    elems.projectsSection.querySelector('.group-inner').innerHTML = result.html;
                    window.setTimeout(init, 10);
                }
            }

            if (result.html.length) {
                isUiTransitioning = true;

                // Switch current category class
                document.body.classList.remove('type-' + currentCategory);
                currentCategory = category;

                // Once transition is done
                document.body.addEventListener(transitionEvent, transitionDone);
                document.body.classList.add('is-transitioning');
                document.body.classList.add('type-' + currentCategory);

                // Change active state class on nav links
                utils.forEach(elems.categorySwitchers, function (index, elem) {
                    elem.classList[elem == event.target ? 'add' : 'remove']('is-selected');
                });
            }

            document.body.removeAttribute('aria-busy');
        }).catch(function (err) {
            console.log('An error occured', err);
            document.body.removeAttribute('aria-busy');
        });
    }

    document.body.setAttribute('aria-busy', true);

    if (window.pageYOffset > 0) {
        utils.scrollToPosition(0, 200, switchCategory);
    } else {
        switchCategory();
    }

    event.preventDefault();
}

function refreshVideos ( ) {
    // Bug fix: Force all videos to play again
    var videos = document.querySelectorAll('.project video');
    if (videos.length) {
        // Use a small timeout to prevent Chromium bug
        setTimeout(function ( ) {
            utils.forEach(document.querySelectorAll('.project video'), function (index, video) {
                video.play();
            });
        }, 50);
    }
}

function initFlickity (project, projectImages, options) {
    projectImages = projectImages || project.querySelector('.project-items');
    var length = project.querySelectorAll('li').length;

    var defaults = {
        cellAlign: 'center',
        wrapAround: true,
        contain: false,
        percentPosition: true,
        prevNextButtons: false,
        pageDots: false,
        setGallerySize: false,
        initialIndex: 4, // Always center on the featured image
        accessibility: false, // Turn off native keyboard navigation
        selectedAttraction: 0.2,
        friction: 0.8,
    };

    // If there are 3 or less cells, change some options
    if (length <= 3) {
        defaults.contain = true;
        defaults.initialIndex = 1;
        defaults.wrapAround = false;
    }

    // Always enable wrapAround on small viewports
    if (breakpoint.value === 'small-viewport') {
        defaults.wrapAround = true;
    }

    // Extend options
    utils.extend(defaults, options);

    var flkty = project.flkty = new Flickity(projectImages, defaults);

    flkty.on('dragStart', function (e) {
        flkty.slider.classList.add('is-dragging');
    });

    flkty.on('dragEnd', function (e) {
        flkty.slider.classList.remove('is-dragging');
    });

    flkty.on('cellSelect', function ( ) {
        lazyBlur.check();
    });
}

function reloadFlickity (project, options) {
    if (!project.flkty) { return; }

    var currentOptions = project.flkty.options;

    project.flkty.destroy();
    initFlickity(project, null, utils.extend(options, currentOptions));
    refreshVideos();
}

function toggleProjectView (event) {
    if (!elems.viewToggler) return;
    event && this.blur();

    elems.viewToggler.querySelector('.label').innerHTML = !stackState ? 'Strip view' : 'Stack view';

    utils.forEach(elems.projects, function (index, project) {
        var projectImages = project.querySelector('.project-items');
        if (!projectImages) return;

        var breakPointChange;

        if (!stackState && breakpoint.value !== 'small-viewport') {
            // Init collage view
            if (project.flkty) {
                project.flkty.destroy();
                if (breakPointChange) {
                    breakPointChange.remove();
                }
            }

            toggleCollapsedProject(projectImages);
            projectImages.addEventListener('mouseenter', toggleExpandedProject);
            projectImages.addEventListener('mouseleave', toggleCollapsedProject);
        } else {
            // Init list view
            toggleExpandedProject(projectImages);
            projectImages.removeEventListener('mouseenter', toggleExpandedProject);
            projectImages.removeEventListener('mouseleave', toggleCollapsedProject);

            initFlickity(project, projectImages);
            breakPointChange = pubsub.subscribe('breakpointChanged', function (values) {
                var previous = values[0];
                var current = values[1];
                var changedFromLarge = (previous === 'medium-viewport' || previous === 'large-viewport') && current === 'small-viewport';
                var changedFromSmall = previous === 'small-viewport' && (current === 'medium-viewport' || current === 'large-viewport');

                if (!stackState && (changedFromLarge || changedFromSmall)) {
                    reloadFlickity(project);
                }
            });
        }
    });

    var closestProject = cache.closestProject;
    if (!stackState && breakpoint.value !== 'small-viewport') {
        document.body.classList.remove('view-list');
        document.body.classList.add('view-collage');

        lazyBlur.check();
        storeProjectPositions();
    } else {
        document.body.classList.remove('view-collage');
        document.body.classList.add('view-list');

        lazyBlur.check();
        storeProjectPositions();
        utils.scrollToElement(closestProject, 200, cache.viewportHeight * 0.3);
    }

    refreshVideos();

    stackState = !stackState;
}

var keysCloseInfoView = function (e) {
    e = e || window.event;

    if (e.which === 27 || e.keyCode === 27) {
        toggleInfoView();
    }
};

var clickOutsideInfo = function (e) {
    if (e.target.classList.contains('section-about')) {
        toggleInfoView();
    }
};

function toggleInfoView (event) {
    event && this.blur();

    if (!aboutState) {
        window.addEventListener('keydown', keysCloseInfoView);
        elems.aboutSection.addEventListener('click', clickOutsideInfo);
        elems.aboutSection.setAttribute('aria-hidden', false);

        setTimeout(function ( ) {
            var scrollbarWidth = cache.viewportWidth - document.body.clientWidth;
            document.documentElement.classList.add('overlay-open');
            document.documentElement.classList.add('about');

            elems.siteHeader.style.right = scrollbarWidth + 'px';
            document.documentElement.style.paddingRight = scrollbarWidth + 'px';

            lazyBlur.check();
        }, 5);
    } else {
        window.removeEventListener('keydown', keysCloseInfoView);
        elems.aboutSection.removeEventListener('click', clickOutsideInfo);
        elems.aboutSection.setAttribute('aria-hidden', true);

        document.documentElement.classList.remove('overlay-open');
        document.documentElement.classList.remove('about');

        elems.siteHeader.style.right = null;
        document.documentElement.style.paddingRight = null;
    }

    uiDisabled = !uiDisabled;
    aboutState = !aboutState;
}

function highlightVisibleProject (lastScrollY) {
    var viewportHeightPercentage = cache.viewportHeight * 0.5;
    var offset = lastScrollY + viewportHeightPercentage;
    var visibleSections = [];

    cache.projectPositions.forEach(function (pos, index) {
        if (!elems.projects[index]) { return; }

        elems.projects[index].classList.remove('is-visible');
        if (offset >= pos) {
            visibleSections.push(index);
        }
        if (index > 0) {
            elems.projects[index - 1].classList.remove('active');
        }
    });

    var currentIndex = visibleSections[visibleSections.length - 1];
    if (elems.projects[currentIndex]) {
        elems.projects[currentIndex].classList.add('is-visible');
        cache.closestProject = elems.projects[currentIndex];
    }
}

function setVideoDimensions (videoEmbed, media) {
    var $image = media.firstElementChild;
    var mediaRect = $image.getBoundingClientRect();
    videoEmbed.style.top = mediaRect.top + 'px';
    videoEmbed.style.left = mediaRect.left + 'px';
    videoEmbed.style.width = mediaRect.width + 'px';
    videoEmbed.style.height = mediaRect.height + 'px';
}

function initZoomableMedia ( ) {
    utils.forEach(elems.projects, function (index, project) {
        var currentlyZoomedIn;
        var items = project.querySelectorAll('.project .project-items a');

        function keysPressed (e) {
            e = e || window.event;

            switch(e.which || e.keyCode) {
                // Left arrow
                case 37:
                    e.preventDefault();
                    togglePrevItem();
                    break;

                // Right arrow
                case 39:
                    e.preventDefault();
                    toggleNextItem();
                    break;

                default: return;
            }
        }

        function togglePrevItem ( ) {
            if (isUiTransitioning) {
                return;
            }

            var currentIndex = Array.prototype.indexOf.call(items, currentlyZoomedIn);
            if (stackState) {
                imgZoom.zoomOut(currentlyZoomedIn, imgZoom.zoomIn.bind(null, items[currentIndex - 1] || items[items.length - 1]));
            } else {
                project.flkty.once('settle', function ( ) {
                    imgZoom.zoomIn(items[project.flkty.selectedIndex] || items[items.length - 1]);
                });
                imgZoom.zoomOut(currentlyZoomedIn);
                project.flkty.previous(true);
            }
        }

        function toggleNextItem ( ) {
            if (isUiTransitioning) {
                return;
            }

            var currentIndex = Array.prototype.indexOf.call(items, currentlyZoomedIn);
            if (stackState) {
                imgZoom.zoomOut(currentlyZoomedIn, imgZoom.zoomIn.bind(null, items[currentIndex + 1] || items[0]));
            } else {
                project.flkty.once('settle', function ( ) {
                    imgZoom.zoomIn(items[project.flkty.selectedIndex] || items[0]);
                });
                imgZoom.zoomOut(currentlyZoomedIn);
                project.flkty.next(true);
            }
        }

        var imgZoom = new ImageZoom(items, {
            offset: 60,
            speed: 160
        });

        imgZoom.on('zoomInStart', function (media) {
            // Cancel current zoom if project isn't expanded and expand the project it immediately
            var projectImages = project.querySelector('.project-items');
            if (projectImages.classList.contains('collapsed')) {
                imgZoom.cancelCurrentZoom();
                toggleExpandedProject(projectImages);
                return;
            }

            // States
            uiDisabled = true;
            isUiTransitioning = true;
            document.documentElement.classList.add('overlay-open');
            currentlyZoomedIn = media;

            if (!stackState) {
                // Add correct z-index stacking order
                project.querySelector('.flickity-slider').style.zIndex = 100;

                // Disable Flickity dragging while zoomed in
                project.flkty.unbindDrag();
            }

            elems.mediaNav.setAttribute('aria-hidden', false);

            // Events
            window.addEventListener('keydown', keysPressed);
        });

        imgZoom.on('zoomInEnd', function (media) {
            // States
            isUiTransitioning = false;

            // Events
            elems.mediaNav.querySelector('.left').addEventListener('click', togglePrevItem);
            elems.mediaNav.querySelector('.right').addEventListener('click', toggleNextItem);

            // Swap in embedded video when src is not an image
            if (!media.href.match(/\.(jpg|jpeg|png|gif)$/)) {
                var mediaRect = media.getBoundingClientRect();
                var video = parseVideo(media.getAttribute('href'));

                var videoEmbed = makeVideoEmbed(video.type, video.id);
                videoEmbed.className = 'zoomed-video';
                setVideoDimensions(videoEmbed, media);

                media.videoResizeEvent = setVideoDimensions.bind(null, videoEmbed, media);
                window.addEventListener('resize', utils.debounce(media.videoResizeEvent), 300);
                window.addEventListener('scroll', utils.throttle(media.videoResizeEvent), 50);

                document.documentElement.appendChild(videoEmbed);
            }
        });

        imgZoom.on('zoomOutStart', function (media) {
            // States
            uiDisabled = false;
            isUiTransitioning = true;
            document.documentElement.classList.remove('overlay-open');
            currentlyZoomedIn = '';

            // Remove swipeable media event listeners
            //utils.onSwipe(media.firstChild, null, true);

            if (!stackState) {
                // Remove z-index stacking order
                project.querySelector('.flickity-slider').style.zIndex = '';

                // Re-enable Flickity dragging
                project.flkty.bindDrag();
            }

            // Events
            elems.mediaNav.querySelector('.left').removeEventListener('click', togglePrevItem);
            elems.mediaNav.querySelector('.right').removeEventListener('click', toggleNextItem);
            window.removeEventListener('keydown', keysPressed);

            // Remove embedded video when src is not image
            if (!media.href.match(/\.(jpg|jpeg|png|gif)$/)) {
                var videoEmbed = document.querySelector('.zoomed-video');
                if (videoEmbed) {
                    videoEmbed.parentNode.removeChild(videoEmbed);
                }

                window.removeEventListener('resize', media.videoResizeEvent);
                window.removeEventListener('scroll', media.videoResizeEvent);
                delete media.videoResize;
            }
        });

        imgZoom.on('zoomOutEnd', function ( ) {
            // States
            isUiTransitioning = false;

            elems.mediaNav.setAttribute('aria-hidden', true);
        });
    });
}

// Navigate slideshow with keyboard
keyboard.on('arrowRight', function (event) {
    event.preventDefault();

    if (isUiTransitioning) {
        return;
    }

    // Toggle previous slide when in strip view
    if (!stackState && !uiDisabled) {
        var focusedProject = document.querySelector('.is-visible');
        focusedProject.flkty.next();
    }
});

keyboard.on('arrowLeft', function (event) {
    event.preventDefault();

    if (isUiTransitioning) {
        return;
    }

    // Toggle next slide when in strip view
    if (!stackState && !uiDisabled) {
        var focusedProject = document.querySelector('.is-visible');
        focusedProject.flkty.previous();
    }
});

function init () {
    lazyBlur = new LazyBlur(document.querySelectorAll('.progressive-media'), {
        blur: 50,
        threshold: 0
    });
    lazyBlur.check();

    elems.projects = document.querySelectorAll('.project');

    if (currentCategory === 'photo') {
        storeProjectPositions();

        if (breakpoint.value === 'small-viewport') {
            // Start at true if we're using a small viewport
            stackState = true;
        }
        toggleProjectView();
        initZoomableMedia();
    } else {
        // Initiate embedded videos
        var videoEmbeds = new VideoEmbed('.video-embed .video-embed-placeholder');
        stackState = false;
        document.body.classList.remove('view-list');
    }
}

breakpoint.update();
init();
