<?php
    $placeholder = $media->placeholder()->toFile();
    $placeholderThumb = thumb($placeholder, array('width' => 1000, 'quality' => 100, 'crop' => false));
    $videoId = uniqid();
?>
<div class="video-embed" style="background-image: url(<?php echo $placeholderThumb->url() ?>);">
    <div id="video-<?= $videoId ?>" data-video-src="<?php echo $media->video(); ?>" itemprop="video" class="video-embed-placeholder" aria-hidden="true" style="padding-bottom: <?= $placeholderThumb->height()/$placeholderThumb->width() * 100 ?>%;"></div>
    <button class="toggle-video" aria-label="Play video" aria-controls="video-<?= $videoId ?>">
        <span class="icon">
            <div class="svg-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="7.207 0 285.586 300"><path opacity=".5" fill="#FFF" d="M149.85 300l-87.988-28.528-54.655-75.076v-92.792l54.655-75.076L150.15 0l88.288 28.528 54.355 75.076v92.792l-54.654 75.076"/><path d="M90.09 84.685v131.532l18.318 11.71 119.82-68.768V141.74L108.41 74.775"/></svg>
            </div>
        </span>
    </button>
</div>
