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

    var images = project.querySelectorAll('.images li');
    utils.forEach(images, function (index, image) {
        utils.requestAnimFrame.call(window, function ( ) {
            image.style.webkitTransform = 'translate3d(-' + (Math.floor(Math.random() * 30) + 1) + 'px, -' + (Math.floor(Math.random() * 30) + 4) + 'px, 0)';
        });
    });
};

utils.forEach(document.querySelectorAll('.project'), function (index, project) {
    toggleCollapsedProject(project);
    project.addEventListener('mouseover', utils.delegate(utils.criteria.hasClass('project'), toggleExpandedProject));
    project.addEventListener('mouseout', utils.delegate(utils.criteria.hasClass('project'), toggleCollapsedProject));
});
