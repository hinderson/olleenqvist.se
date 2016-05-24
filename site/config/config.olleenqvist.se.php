<?php

    // Deactivate debug
    c::set('debug', false);

    // Activate cache
    c::set('cache', true);
    c::set('cache.driver', 'memcached');

    // Set global CDN url
    c::set('cdnUrl', 'https://d11zb26c27eya9.cloudfront.net');

    // CDN settings
    c::set('cdn.assets', 'https://d11zb26c27eya9.cloudfront.net');
    c::set('cdn.content', false);
    c::set('cdn.thumbs', false);

    // CDN paths
    c::set('pathAssets', 'https://d11zb26c27eya9.cloudfront.net/dist');
    c::set('pathThumbs', 'https://d11zb26c27eya9.cloudfront.net/thumbs');
    c::set('pathContent', 'https://d11zb26c27eya9.cloudfront.net/content');
