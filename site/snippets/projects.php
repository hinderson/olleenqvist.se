<h2 class="visuallyhidden">Latest projects</h2>

<div class="projects">
    <?php foreach(page('projects')->children()->visible() as $project): ?>
        <div class="project <?php echo $project->uid() ?>">
            <h3><a href="<?php echo $project->url() ?>"><?php echo $project->title()->html() ?></a></h3>
            <h4><?php echo $project->subtitle()->html() ?></h4>
            <p><?php echo $project->description()->excerpt(80) ?> <a href="<?php echo $project->url() ?>">read&nbsp;more&nbsp;→</a></p>
            <?php if($image = $project->images()->sortBy('sort', 'asc')->first()): ?>
                <a href="<?php echo $project->url() ?>">

                    <?php
                        $thumbGigantic = thumb($project->images()->first(), array('width' => 1500, 'quality' => 100));
                        $thumbLarge = thumb($project->images()->first(), array('width' => 980, 'quality' => 100));
                        $thumbMedium = thumb($project->images()->first(), array('width' => 860, 'quality' => 90));
                        $thumbSmall = thumb($project->images()->first(), array('width' => 440, 'quality' => 85));
                    ?>
                    <img src="<?php echo $thumbMedium->url() ?>" srcset="<?php echo $thumbLarge->url() ?> <?php echo $thumbLarge->width() ?>w, <?php echo $thumbMedium->url() ?> <?php echo $thumbMedium->width() ?>w, <?php echo $thumbSmall->url() ?> <?php echo $thumbSmall->width() ?>w" sizes="100vw" alt="<?php echo $project->title()->html() ?>">
                </a>
            <?php endif ?>
        </div>
    <?php endforeach ?>
</div>
