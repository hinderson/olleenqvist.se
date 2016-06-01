<?php

// Deactivate debug
c::set('debug', false);

// Activate cache
c::set('cache', true);
c::set('cache.driver', 'memcached');

// Set global CDN url
c::set('cdnUrl', 'https://d32x2ylr3hfw2f.cloudfront.net');

// CDN settings
c::set('cdn.assets', 'https://d32x2ylr3hfw2f.cloudfront.net');
c::set('cdn.content', false);
c::set('cdn.thumbs', false);

// Force SSL
c::set('ssl', true);

// CDN paths
c::set('pathAssets', 'https://d32x2ylr3hfw2f.cloudfront.net/dist');
c::set('pathThumbs', 'https://d32x2ylr3hfw2f.cloudfront.net/thumbs');
c::set('pathContent', 'https://d32x2ylr3hfw2f.cloudfront.net/content');
