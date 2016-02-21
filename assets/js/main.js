'use strict';

// Requires
var utils = require('./utils.js');
var Flickity = require('flickity-imagesloaded');

var viewToggler = document.querySelector('.view-toggler');
viewToggler.addEventListener('click', function (e) {
    e.preventDefault();
});

var toggleExpandedProject = function (e) {
    var project = e.delegateTarget;

    switch (e.type) {
		case 'mouseover':
            project.classList.remove('collapsed');
            project.classList.add('expanded');
			break;
		case 'mouseout':
            project.classList.remove('expanded');
            project.classList.add('collapsed');
			break;
	}
};

var projects = document.querySelectorAll('.project');
utils.forEach(projects, function (index, project) {
    project.classList.add('collapsed');
    project.addEventListener('mouseover', utils.delegate(utils.criteria.hasClass('project'), toggleExpandedProject.bind(this)));
    project.addEventListener('mouseout', utils.delegate(utils.criteria.hasClass('project'), toggleExpandedProject.bind(this)));
});
