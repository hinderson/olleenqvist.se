'use strict';

// Requires
var utils = require('./utils.js');
var Flickity = require('flickity-imagesloaded');

var viewToggler = document.querySelector('.view-toggler');
viewToggler.addEventListener('click', function (e) {
    e.preventDefault();
});

var toggleExpandedProject = function (e) {
    var project = e.delegateTarget || e;

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
    var project = e.delegateTarget || e;
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

utils.forEach(document.querySelectorAll('.project'), function (index, project) {
    toggleCollapsedProject(project);
    project.addEventListener('mouseover', utils.delegate(utils.criteria.hasClass('project'), toggleExpandedProject));
    project.addEventListener('mouseout', utils.delegate(utils.criteria.hasClass('project'), toggleCollapsedProject));
});
