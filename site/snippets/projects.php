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
                                        $original = thumb($media, array('width' => 1500, 'quality' => 100));
                                        $thumb = thumb($media, array('width' => 288, 'height' => 190, 'quality' => 90));
                                        $retina = thumb($media, array('width' => 576, 'height' => 380, 'quality' => 90));
                                        $micro = thumb($media, array('width' => 50, 'quality' => 100));
                                    ?>
                                    <a href="<?php echo $original->url() ?>" data-zoomable data-width="<?php echo $original->width() ?>" data-height="<?php echo $original->height() ?>">
                                        <div class="progressive-media" data-attributes='{ "src" : "<?php echo $thumb->url() ?>", "srcset": "<?php echo $thumb->url() ?> 1x, <?php echo $retina->url() ?> 2x", "width": "<?php echo $thumb->width() ?>", "height" : "<?php echo $thumb->height() ?>", "alt": "<?php echo $project->title()->html() ?>"}'>
                                            <img src="<?php echo $micro->url() ?>" width="<?php echo $thumb->width() ?>" height="<?php echo $thumb->height() ?>" crossorigin="anonymous" class="thumb" alt="">
                                            <canvas width="<?php echo $thumb->width() ?>" height="<?php echo $thumb->height() ?>"></canvas>
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
                        <h3><a href="<?php echo $project->url() ?>"><?php echo $project->title()->html() ?></a></h3>
                        <h4><?php echo $project->subtitle()->html() ?></h4>
                        <p><?php echo $project->description()->excerpt(270) ?></p>
                    </div>
                </div>
            <?php endforeach ?>
        </div>
    </div>
</section>
