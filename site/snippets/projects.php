<h2 class="visuallyhidden">Latest projects</h2>

<div class="projects">
    <div class="group">
        <div class="group-inner">
            <?php foreach(page('projects')->children()->visible() as $project): ?>
                <div class="project <?php echo $project->uid() ?>">
                    <ul class="images">
                        <?php foreach($project->images()->limit(9)->sortBy('sort', 'asc') as $image): ?>
                            <li>
                                <a href="<?php echo $image->url() ?>">
                                    <?php
                                        $thumbGigantic = thumb($image, array('width' => 1500, 'quality' => 100));
                                        $thumbLarge = thumb($image, array('width' => 980, 'quality' => 100));
                                        $thumbMedium = thumb($image, array('width' => 860, 'quality' => 90));
                                        $thumbSmall = thumb($image, array('width' => 440, 'quality' => 85));
                                    ?>
                                    <img src="<?php echo $thumbMedium->url() ?>" srcset="<?php echo $thumbLarge->url() ?> <?php echo $thumbLarge->width() ?>w, <?php echo $thumbMedium->url() ?> <?php echo $thumbMedium->width() ?>w, <?php echo $thumbSmall->url() ?> <?php echo $thumbSmall->width() ?>w" sizes="100vw" alt="<?php echo $project->title()->html() ?>">
                                </a>
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
</div>
