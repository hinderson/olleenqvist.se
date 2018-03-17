<?php

return function($site, $pages, $page) {
    $type = trim(get('type')) ?: 'photo';
    $projects = page('projects')->children()->visible()->filterBy('category', strtolower($type));

    return compact('projects');
};
