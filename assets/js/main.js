'use strict';

// Requires
var Flickity = require('flickity-imagesloaded');

var viewToggler = document.querySelector('.view-toggler');
viewToggler.addEventListener('click', function (e) {
    alert('Ayooooo');
    e.preventDefault();
});
