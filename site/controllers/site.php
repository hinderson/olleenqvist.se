<?php

return function($site, $pages, $page) {
    $type = trim(get('type'));
    if (!empty($type)) {
        $projects = page('projects/' . $type)->children()->visible();
    } else {
        // Get first subpage in list
        $first_type = page('projects')->children()->first();
        $type = strtolower($first_type->title()->lower());
        $projects = $first_type->children()->visible();
    }

    return compact('projects', 'type');
};
