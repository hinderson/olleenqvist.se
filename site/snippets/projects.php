<section class="projects">
    <header>
        <h2 class="visuallyhidden">Projects</h2>
    </header>
    <div class="group">
        <div class="group-inner">
            <?php foreach(page('projects')->children()->visible() as $project): ?>
                <div class="project <?php echo strtolower($project->uid()) ?>">
                    <ul class="images">
                        <?php foreach($project->files()->limit(9)->sortBy('sort', 'asc') as $media): ?>
                            <li>
                                <?php
                                    $ext = pathinfo($media);
                                    $contentType = ((array_key_exists('extension', $ext) and $ext['extension'] === 'mp4')) ? 'video': 'image';
                                ?>

                                <?php if ($contentType == "video") :  ?>

                                <?php else: ?>
                                    <?php
                                        $thumbWidth = 328;
                                        $thumbHeight = 219;
                                        $original = thumb($media, array('width' => 1500, 'height' => 1000, 'quality' => 100, 'crop' => true));
                                        $thumb = thumb($media, array('width' => $thumbWidth, 'height' => $thumbHeight, 'quality' => 90, 'crop' => true));
                                        $retina = thumb($media, array('width' => ($thumbWidth * 2), 'height' => ($thumbHeight * 2), 'quality' => 90, 'crop' => true));
                                        $micro = thumb($media, array('width' => 50, 'quality' => 100));
                                    ?>
                                    <a href="<?php echo $original->url() ?>" data-zoomable data-width="<?php echo $original->width() ?>" data-height="<?php echo $original->height() ?>">
                                        <div class="progressive-media" data-attributes='{ "src" : "<?php echo $thumb->url() ?>", "srcset": "<?php echo $thumb->url() ?> 1x, <?php echo $retina->url() ?> 2x", "width": "<?php echo $thumb->width() ?>", "height" : "<?php echo $thumb->height() ?>", "alt": "<?php echo $project->title()->html() ?>"}'>
                                            <div class="aspect-ratio" style="padding-bottom: <?php echo ($thumbHeight / $thumbWidth) * 100 ?>%;"></div>
                                            <img src="<?php echo $micro->url() ?>" crossorigin="anonymous" aria-hidden="true" class="thumb" alt="">
                                            <canvas width="<?php echo $thumbWidth ?>" height="<?php echo $thumbHeight ?>"></canvas>
                                            <noscript>
                                                <img src="<?php echo $thumb->url() ?>" srcset="<?php echo $thumb->url() ?> 1x, <?php echo $retina->url() ?> 2x" width="<?php echo $thumb->width() ?>" height="<?php echo $thumb->height() ?>" alt="<?php echo $project->title()->html() ?>">
                                            </noscript>
                                        </div>
                                    </a>
                                <?php endif ?>
                            </li>
                        <?php endforeach ?>
                    </ul>
                    <div class="description">
                        <h3><?php echo $project->title()->html() ?></h3>
                        <h4><?php echo $project->subtitle()->html() ?></h4>
                        <p><?php echo $project->description()->excerpt(270) ?></p>
                    </div>
                </div>
            <?php endforeach ?>
        </div>
    </div>
</section>
