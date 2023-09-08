<?php

// Deactivate debug
c::set('debug', false);

// Activate cache
c::set('cache', true);
c::set('cache.driver', 'memcached');

// Force SSL
c::set('ssl', true);

// Set global CDN url
c::set('cdnUrl', 'https://olleenqvist.se/dist');

// CDN settings
c::set('cdn.assets', 'https://olleenqvist.se/dist');
c::set('cdn.content', false);
c::set('cdn.thumbs', false);

// CDN paths
c::set('pathAssets', 'https://olleenqvist.se/dist');
c::set('pathThumbs', 'https://olleenqvist.se/thumbs');
c::set('pathContent', 'https://olleenqvist.se/content');
