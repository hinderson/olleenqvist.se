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
                                        $thumbGigantic = thumb($media, array('width' => 1500, 'quality' => 100));
                                        $thumbLarge = thumb($media, array('width' => 980, 'height' => 653, 'crop' => true, 'quality' => 100));
                                        $thumbMedium = thumb($media, array('width' => 860, 'height' => 573, 'crop' => true, 'quality' => 90));
                                        $thumbSmall = thumb($media, array('width' => 440, 'height' => 293, 'crop' => true, 'quality' => 85));
                                        $thumbMicro = thumb($media, array('width' => 50, 'quality' => 80));
                                    ?>
                                    <a href="<?php echo $thumbGigantic->url() ?>" data-zoomable data-width="<?php echo $thumbGigantic->width() ?>" data-height="<?php echo $thumbGigantic->height() ?>">
                                        <div class="progressive-media" data-attributes='{ "srcset": "<?php echo $thumbLarge->url() ?> <?php echo $thumbLarge->width() ?>w, <?php echo $thumbMedium->url() ?> <?php echo $thumbMedium->width() ?>w, <?php echo $thumbSmall->url() ?> <?php echo $thumbSmall->width() ?>w", "sizes": "100vw", "alt": "<?php echo $project->title()->html() ?>"}'>
                                            <img src="<?php echo $thumbMicro->url() ?>" width="<?php echo $thumbLarge->width() ?>" height="<?php echo $thumbLarge->height() ?>" crossorigin="anonymous" class="thumb" alt="">
                                            <canvas width="<?php echo $thumbLarge->width() ?>" height="<?php echo $thumbLarge->height() ?>"></canvas>
                                            <noscript>
                                                <img src="<?php echo $thumbSmall->url() ?>" srcset="<?php echo $thumbLarge->url() ?> <?php echo $thumbLarge->width() ?>w, <?php echo $thumbMedium->url() ?> <?php echo $thumbMedium->width() ?>w, <?php echo $thumbSmall->url() ?> <?php echo $thumbSmall->width() ?>w" sizes="100vw" alt="<?php echo $project->title()->html() ?>">
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
