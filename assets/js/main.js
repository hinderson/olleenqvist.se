'use strict';

// Requires
var utils = require('./utils.js');
var Flickity = require('flickity-imagesloaded');

// States
var collageState = false;

// Elements
var projectElems = document.querySelectorAll('.project');
var viewToggler = document.querySelector('.view-toggler button');

// Event listeners
viewToggler.addEventListener('click', utils.throttle(toggleProjectView, 300));

var toggleExpandedProject = function (e) {
    var project = e.target || e;

    project.classList.remove('collapsed');
    project.classList.add('expanded');

    var images = project.querySelectorAll('.images li');
    utils.forEach(images, function (index, image) {
        utils.requestAnimFrame.call(window, function ( ) {
            image.style.webkitTransform = '';
        });
    });
};

var toggleCollapsedProject = function (e) {
    var project = e.target || e;
    project.classList.remove('expanded');
    project.classList.add('collapsed');

    function getCoords (min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    utils.forEach(project.querySelectorAll('.images li'), function (index, image) {
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
    viewToggler.querySelector('.label').innerHTML = !collageState ? 'Collage view' : 'List view';

    utils.forEach(projectElems, function (index, project) {
        if (!collageState) {
            document.documentElement.classList.remove('view-list');
            document.documentElement.classList.add('view-collage');

            toggleCollapsedProject(project);
            project.addEventListener('mouseenter', toggleExpandedProject);
            project.addEventListener('mouseleave', toggleCollapsedProject);

            if (project.flkty) {
                project.flkty.destroy();
            }
        } else {
            toggleExpandedProject(project);
            project.removeEventListener('mouseenter', toggleExpandedProject);
            project.removeEventListener('mouseleave', toggleCollapsedProject);

            setTimeout(function ( ) {
                project.flkty = new Flickity(project.querySelector('.images'), {
                    cellAlign: 'center',
                    wrapAround:true,
                    contain: true,
                    percentPosition: true,
                    prevNextButtons: false,
                    pageDots: false,
                    initialIndex: 4, // Always center on the featured image
                    imagesLoaded: true,
                });

                document.documentElement.classList.remove('view-collage');
                document.documentElement.classList.add('view-list');
            }, 250);
        }
    });

    collageState = !collageState;
}

toggleProjectView();

/*



*/
