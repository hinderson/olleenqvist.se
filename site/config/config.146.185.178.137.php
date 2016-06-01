<?php

// Deactivate debug
c::set('debug', false);

// Deactivate cache
c::set('cache', true);

// Path settings
c::set('pathAssets', kirby()->urls()->assets());
c::set('pathThumbs', kirby()->urls()->thumbs());
c::set('pathContent', kirby()->urls()->content());
