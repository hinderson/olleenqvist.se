<section class="projects">
    <header>
        <h2 class="visuallyhidden">Projects</h2>
    </header>
    <div class="group">
        <div class="group-inner">
            <?php foreach(page('projects')->children()->visible() as $project): ?>
                <div class="project <?php echo strtolower($project->uid()) ?>">
                    <ul class="project-items cf">
                        <?php foreach($project->media()->limit(9)->toStructure() as $media): ?>
                            <?php
                                $mediaType = $media->_fieldset();
                                $thumbWidth = 328;
                                $thumbHeight = 219;

                                if ($mediaType == 'video') {
                                    $source = $media->placeholder()->toFile();
                                    $screenshotFilename = basename($source, '.mp4') . '.jpg';
                                    $screenshot = kirby()->roots()->thumbs() . '/' . $screenshotFilename;
                                    $videoThumb = kirby()->roots()->thumbs() . '/' . basename($source, '.mp4') . '.mp4';

                                    $ffmpeg = '/usr/bin/ffmpeg';
                                    try {
                                        // Generate placeholder thumbnail from video still
                                        $escapedSource = escapeshellcmd($source);
                                        $cmd1 = "ffmpeg -i $escapedSource -ss 00:00:01.000 -vframes 1 $screenshot";
                                        exec($cmd1);

                                        $thumbFile = new Media($screenshot);

                                        // Generate cropped and resized video thumbnail
                                        $cmd2 = "ffmpeg -i $escapedSource -vf 'scale=(iw*sar)*max($thumbWidth/(iw*sar)\,$thumbHeight/ih):ih*max($thumbWidth/(iw*sar)\,$thumbHeight/ih), crop=$thumbWidth:$thumbHeight' $videoThumb";
                                        exec($cmd2);

                                        $videoFile = new Media($videoThumb);

                                    } catch (Exception $e) {
                                        var_dump($e->getMessage());
                                    }
                                } else {
                                    $source = $media->image()->toFile();
                                    $thumbFile = $source;
                                }

                                if (isset($thumbFile)) {
                                    $original = thumb($thumbFile, array('width' => 1500, 'height' => 1000, 'quality' => 100, 'crop' => true));
                                    $thumb = thumb($thumbFile, array('width' => $thumbWidth, 'height' => $thumbHeight, 'quality' => 90, 'crop' => true));
                                    $retina = thumb($thumbFile, array('width' => ($thumbWidth * 2), 'height' => ($thumbHeight * 2), 'quality' => 90, 'crop' => true));
                                    $micro = thumb($thumbFile, array('width' => 50, 'height' => 33, 'quality' => 20, 'crop' => true));
                                }
                            ?>

                            <li>
                                <a href="<?php echo e($mediaType == 'video', $media->video(), $original->url()) ?>" data-zoomable data-width="1500" data-height="1000"<?php if ($mediaType == 'video') : ?> data-type="video"<?php endif ?>>
                                    <?php if ($mediaType == 'video') : ?>
                                        <div class="progressive-media <?php echo $mediaType; ?>" data-attributes='{ "src": "<?php echo c::get('pathThumbs') . '/' . $videoFile->filename(); ?>", "muted" : "", "autoplay": "", "loop": "", "playsinline": "" }'<?php if ($mediaType == 'video') : ?> data-video-fallback="<?php echo c::get('pathThumbs') . '/' . $screenshotFilename ?>"<?php endif ?>>
                                            <div class="aspect-ratio" style="padding-bottom: <?php echo ($thumbHeight / $thumbWidth) * 100 ?>%;"></div>
                                            <img src="<?php echo c::get('pathThumbs') . '/' . $micro->filename(); ?>" crossorigin="anonymous" aria-hidden="true" class="thumb" alt="">
                                            <canvas width="<?php echo $thumbWidth ?>" height="<?php echo $thumbHeight ?>"></canvas>
                                            <noscript>
                                                <video src="<?php echo c::get('pathThumbs') . '/' . $videoFile->filename(); ?>" muted autoplay loop class="media"></video>
                                            </noscript>
                                        </div>
                                    <?php else : ?>
                                        <div class="progressive-media <?php echo $mediaType; ?>" data-attributes='{ "src" : "<?php echo $thumb->url() ?>", "srcset": "<?php echo $thumb->url() ?> 1x, <?php echo $retina->url() ?> 2x", "width": "<?php echo $thumb->width() ?>", "height" : "<?php echo $thumb->height() ?>", "alt": "<?php echo $project->title()->html() ?>"}'>
                                            <div class="aspect-ratio" style="padding-bottom: <?php echo ($thumbHeight / $thumbWidth) * 100 ?>%;"></div>
                                            <img src="<?php echo $micro->url() ?>" crossorigin="anonymous" aria-hidden="true" class="thumb" alt="">
                                            <canvas width="<?php echo $thumbWidth ?>" height="<?php echo $thumbHeight ?>"></canvas>
                                            <noscript>
                                                <img src="<?php echo $thumb->url() ?>" srcset="<?php echo $thumb->url() ?> 1x, <?php echo $retina->url() ?> 2x" width="<?php echo $thumb->width() ?>" height="<?php echo $thumb->height() ?>" alt="<?php echo $project->title()->html() ?>" class="media">
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
