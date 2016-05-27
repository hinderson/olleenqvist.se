<?php $about = $pages->visible()->find('about'); ?>

<section class="about" aria-hidden="true">
    <header>
        <h2 class="visuallyhidden" aria-hidden="true"><?php echo $about->title()->html() ?></h2>
    </header>

    <div class="content">
        <?php
            $thumbSmall = thumb($about->images()->first(), array('width' => 600, 'height' => 800, 'quality' => 100, 'crop' => true));
            $thumbMedium = thumb($about->images()->first(), array('width' => 440, '', 'quality' => 95, 'crop' => true));
            $thumbLarge = thumb($about->images()->first(), array('width' => 200, '', 'quality' => 90, 'crop' => true));
        ?>
        <img src="<?php echo $thumbSmall->url() ?>" srcset="<?php echo $thumbLarge->url() ?> <?php echo $thumbLarge->width() ?>w, <?php echo $thumbMedium->url() ?> <?php echo $thumbMedium->width() ?>w, <?php echo $thumbSmall->url() ?> <?php echo $thumbSmall->width() ?>w" sizes="100vw" alt="">
        <div class="info">
            <?php echo $about->text()->kirbytext() ?>
        </div>
    </div>
</section>
