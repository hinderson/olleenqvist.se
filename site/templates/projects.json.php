<?php

$html = '';

foreach($projects as $project) {
    $html .= snippet('project', compact('project'), true);
}

$data['html'] = $html;

// JSON encode the $data array
echo json_encode($data);
