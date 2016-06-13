<section class="projects">
    <header>
        <h2 class="visuallyhidden">Projects</h2>
    </header>
    <div class="group">
        <div class="group-inner">
            <?php foreach(page('projects')->children()->visible() as $project): ?>
                <div class="project <?php echo strtolower($project->uid()) ?>">
                    <ul class="images cf">
                        <?php foreach($project->media()->limit(9)->toStructure() as $media): ?>
                            <li>
                                <?php
                                    $mediaType = $media->_fieldset();

                                    if ($mediaType == 'video') {
                                        $source = $media->placeholder()->toFile();
                                        $screenshotName = basename($source, '.mp4');
                                        $path = kirby()->roots()->thumbs() . '/' . $screenshotName . '.jpg';

                                        if (file_exists($path)) {
                                            $file = new Media($path);
                                            $videoSrc = c::get('pathContent') . substr(strstr($source->dir(), '/content'), strlen('/content')) . '/' . $source->filename();
                                        }
                                    } else {
                                        $source = $media->image()->toFile();
                                        $file = $source;
                                    }

                                    $thumbWidth = 328;
                                    $thumbHeight = 219;
                                    $original = thumb($file, array('width' => 1500, 'height' => 1000, 'quality' => 100, 'crop' => true));
                                    $thumb = thumb($file, array('width' => $thumbWidth, 'height' => $thumbHeight, 'quality' => 90, 'crop' => true));
                                    $retina = thumb($file, array('width' => ($thumbWidth * 2), 'height' => ($thumbHeight * 2), 'quality' => 90, 'crop' => true));
                                    $micro = thumb($file, array('width' => 50, 'height' => 33, 'quality' => 20, 'crop' => true));
                                ?>

                                <a href="<?php echo e($mediaType == 'video', $media->video(), c::get('pathThumbs') . '/' . $original->filename()) ?>" data-zoomable data-width="<?php echo $original->width() ?>" data-height="<?php echo $original->height() ?>"<?php if ($mediaType == 'video') : ?> data-video-fallback="<?php echo c::get('pathThumbs') . '/' . $screenshotName ?>.jpg"<?php endif ?>>
                                    <?php if ($mediaType == 'video') : ?>
                                        <div class="progressive-media <?php echo $mediaType; ?>" data-attributes='{ "src": "<?php echo $videoSrc ?>", "muted" : "", "autoplay": "", "loop": "", "webkit-playsinline": "" }'>
                                            <div class="aspect-ratio" style="padding-bottom: <?php echo ($thumbHeight / $thumbWidth) * 100 ?>%;"></div>
                                            <img src="<?php echo c::get('pathThumbs') . '/' . $micro->filename() ?>" crossorigin="anonymous" aria-hidden="true" class="thumb" alt="">
                                            <canvas width="<?php echo $thumbWidth ?>" height="<?php echo $thumbHeight ?>"></canvas>
                                            <noscript>
                                                <video src="<?php echo $videoSrc ?>" muted autoplay loop class="media"></video>
                                            </noscript>
                                        </div>
                                    <?php else : ?>
                                        <div class="progressive-media <?php echo $mediaType; ?>" data-attributes='{ "src" : "<?php echo c::get('pathThumbs') . '/' . $thumb->filename() ?>", "srcset": "<?php echo c::get('pathThumbs') . '/' . $thumb->filename() ?> 1x, <?php echo c::get('pathThumbs') . '/' . $retina->filename() ?> 2x", "width": "<?php echo $thumb->width() ?>", "height" : "<?php echo $thumb->height() ?>", "alt": "<?php echo $project->title()->html() ?>"}'>
                                            <div class="aspect-ratio" style="padding-bottom: <?php echo ($thumbHeight / $thumbWidth) * 100 ?>%;"></div>
                                            <img src="<?php echo c::get('pathThumbs') . '/' . $micro->filename() ?>" crossorigin="anonymous" aria-hidden="true" class="thumb" alt="">
                                            <canvas width="<?php echo $thumbWidth ?>" height="<?php echo $thumbHeight ?>"></canvas>
                                            <noscript>
                                                <img src="<?php echo c::get('pathThumbs') . '/' . $thumb->filename() ?>" srcset="<?php echo c::get('pathThumbs') . '/' . $thumb->filename() ?> 1x, <?php echo c::get('pathThumbs') . '/' . $retina->filename() ?> 2x" width="<?php echo $thumb->width() ?>" height="<?php echo $thumb->height() ?>" alt="<?php echo $project->title()->html() ?>" class="media">
                                            </noscript>
                                        </div>
                                    <?php endif ?>
                                </a>
                            </li>
                        <?php endforeach ?>
                    </ul>
                    <div class="description">
                        <h3><?php echo $project->title()->html() ?></h3>
                        <?php if ($project->subtitle()->isNotEmpty()) {
                            echo '<h4>' . $project->subtitle()->html() . '</h4>';
                        } ?>
                        <p><?php echo $project->description()->excerpt(270) ?></p>
                    </div>
                </div>
            <?php endforeach ?>
        </div>
    </div>
    <nav class="media-nav" role="navigation" aria-hidden="true">
        <button class="left">
            <span class="svg-container">
                <?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-arrow-left.svg') ?>
            </span>
        </button>
        <button class="right">
            <span class="svg-container">
                <?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-arrow-right.svg') ?>
            </span>
        </button>
    </nav>
</section>
