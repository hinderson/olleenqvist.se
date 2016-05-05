'use strict';

// Requires
var utils = require('./utils.js');
var pubsub = require('./pubsub.js');
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

// Saved constructors
var imgZooms = [];

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
var projectItems = document.querySelectorAll('.project .images');
var projectLinks = document.querySelectorAll('.project .images a');
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

    if (breakpoint.value === 'small-viewport') {
        if (imgZooms.length) {
            utils.forEach(imgZooms, function (index, imgZoom) {
                imgZoom.destroy();
                imgZoom = '';
            });
            imgZooms.length = 0;

            utils.forEach(projectLinks, function (index, elem) {
                elem.addEventListener('click', function (e) {
                    e.preventDefault();
                });
            });
        }

        // Collage state isn't available in mobile view
        if (stackState) {
            toggleProjectView();
        }
    } else {
        if (!imgZooms.length) {
            initZoomableMedia();
        }
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
    var container = document.createElement('DIV');
    var videoEmbed = document.createElement('IFRAME');
    if (vendor === 'youtube') {
        videoEmbed.setAttribute('src', 'https://www.youtube.com/embed/' + id + '?autoplay=1&showinfo=0&controls=0&rel=0&showinfo=0');
    } else if (vendor === 'vimeo') {
        videoEmbed.setAttribute('src', 'https://player.vimeo.com/video/' + id + '?autoplay=true&title=0&byline=0&portrait=0');
    } else {
        return;
    }

    videoEmbed.setAttribute('webkitallowfullscreen', '');
    videoEmbed.setAttribute('mozallowfullscreen', '');
    videoEmbed.setAttribute('allowfullscreen', '');
    videoEmbed.setAttribute('frameborder', 0);
    container.appendChild(videoEmbed);

    return container;
}

// Initiate progressive media lazyloader
var lazyBlur = new LazyBlur(document.querySelectorAll('.progressive-media'), {
    blur: 30
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
        image.style.msTransform = '';
        image.style.webkitTransform = '';
        image.style.transform = '';
    });
};

var toggleCollapsedProject = function (e) {
    if (uiDisabled) { return; }

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

function toggleProjectView ( ) {
    viewToggler.querySelector('.label').innerHTML = !stackState ? 'Strip view' : 'Stack view';

    utils.forEach(projectElems, function (index, project) {
        var projectImages = project.querySelector('.images');
        var projectListItems = project.querySelectorAll('li');
        var length = projectListItems.length;

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

            var flkty = project.flkty = new Flickity(projectImages, {
                cellAlign: 'center',
                wrapAround: length > 3 ? true : false,
                contain: length > 3 ? false : true,
                percentPosition: true,
                prevNextButtons: false,
                pageDots: false,
                setGallerySize: false,
                initialIndex: length > 3 ? 4 : 1, // Always center on the featured image
                accessibility: false, // Turn off native keyboard navigation
                selectedAttraction: 0.2,
                friction: 0.8,
            });

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
    });

    var closestProject = cache.closestProject;
    if (!stackState) {
        document.documentElement.classList.remove('view-list');
        document.documentElement.classList.add('view-collage');

        lazyBlur.check();
        storeProjectPositions();
    } else {
        document.documentElement.classList.remove('view-collage');
        document.documentElement.classList.add('view-list');

        lazyBlur.check();
        storeProjectPositions();
        utils.scrollToElement(closestProject, 200, cache.viewportHeight * 0.3);
    }

    // Bug fix: Force all videos to play again
    var videos = document.querySelectorAll('.project video');
    if (videos.length) {
        utils.forEach(document.querySelectorAll('.project video'), function (index, video) {
            video.play();
        });
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
            document.body.classList.add('about');
        }, 5);
    } else {
        window.removeEventListener('keydown', keysCloseInfoView);
        aboutElem.removeEventListener('click', clickOutsideInfo);
        aboutElem.setAttribute('aria-hidden', true);
        document.body.classList.remove('overlay-open');
        document.body.classList.remove('about');
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

function initZoomableMedia ( ) {
    utils.forEach(projectElems, function (index, item) {
        var imgZoom = new ImageZoom(item.querySelectorAll('.images a'), {
            offset: 60
        });
        imgZooms.push(imgZoom);

        imgZoom.on('zoomInStart', function ( ) {
            uiDisabled = true;
            document.body.classList.add('overlay-open');
        });

        function setVideoDimensions (videoEmbed, media) {
            var mediaRect = media.getBoundingClientRect();
            videoEmbed.style.top = mediaRect.top + 'px';
            videoEmbed.style.left = mediaRect.left + 'px';
            videoEmbed.style.width = mediaRect.width + 'px';
        }

        imgZoom.on('zoomInEnd', function (media) {
            if (!media.href.match(/\.(jpg|jpeg|png|gif)$/)) {
                var mediaRect = media.getBoundingClientRect();
                var video = parseVideo(media.getAttribute('href'));

                var videoEmbed = makeVideoEmbed(video.type, video.id);
                videoEmbed.className = 'zoomed-video';
                setVideoDimensions(videoEmbed, media);

                media.videoResizeEvent = setVideoDimensions.bind(null, videoEmbed, media);
                window.addEventListener('resize', utils.debounce(media.videoResizeEvent), 300);

                document.documentElement.appendChild(videoEmbed);
            }
        });

        imgZoom.on('zoomOutStart', function (media) {
            uiDisabled = false;
            document.body.classList.remove('overlay-open');

            if (!media.href.match(/\.(jpg|jpeg|png|gif)$/)) {
                var videoEmbed = document.querySelector('.zoomed-video');
                videoEmbed.parentNode.removeChild(videoEmbed);

                window.removeEventListener('resize', media.videoResizeEvent);
                delete media.videoResize;
            }
        });
    });
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

breakpoint.update();
storeProjectPositions();

toggleProjectView();

// Initiate zoomable images
if (breakpoint.value !== 'small-viewport') {
    initZoomableMedia();
}
