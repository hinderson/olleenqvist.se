<?php

// Deactivate debug
c::set('debug', false);

// Activate cache
c::set('cache', true);
c::set('cache.driver', 'memcached');

// Force SSL
c::set('ssl', true);

// Set global CDN url
c::set('cdnUrl', 'https://d3omkl1g7kevbp.cloudfront.net');

// CDN settings
c::set('cdn.assets', 'https://d32x2ylr3hfw2f.cloudfront.net');
c::set('cdn.content', false);
c::set('cdn.thumbs', false);

// CDN paths
c::set('pathAssets', 'https://d32x2ylr3hfw2f.cloudfront.net');
c::set('pathThumbs', 'https://d3omkl1g7kevbp.cloudfront.net/thumbs');
c::set('pathContent', 'https://d3omkl1g7kevbp.cloudfront.net/content');
