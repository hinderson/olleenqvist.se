<?php

    // Deactivate debug
    c::set('debug', false);

    // Activate cache
    c::set('cache', true);
    c::set('cache.driver', 'memcached');

    // Set global CDN url
    c::set('cdnUrl', '');

    // CDN settings
    c::set('cdn.assets', '/dist');
    c::set('cdn.content', '/content');
    c::set('cdn.thumbs', '/thumbs');
