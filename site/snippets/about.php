<?php $about = $pages->visible()->find('about'); ?>

<section class="about" aria-hidden="true">
    <header>
        <h2 class="visuallyhidden" aria-hidden="true"><?php echo $about->title()->html() ?></h2>
    </header>

    <div class="content">
        <?php
            $file = $about->images()->first();

            $thumbLarge = thumb($file, array('width' => 1200, '', 'quality' => 90));
            $thumbMedium = thumb($file, array('width' => 840, '', 'quality' => 90));
            $thumbSmall = thumb($file, array('width' => 620, 'quality' => 90));
            $thumbMicro = thumb($file, array('width' => 50, 'quality' => 20));

            $aspectRatio = ($thumbMicro->height() / $thumbMicro->width()) * 100;
        ?>
            <div class="progressive-media" data-attributes='{ "src": "<?php echo c::get('pathThumbs') . '/' . $thumbSmall->filename() ?>", "srcset": "<?php echo c::get('pathThumbs') . '/' . $thumbLarge->filename() ?> <?php echo $thumbLarge->width() ?>w, <?php echo c::get('pathThumbs') . '/' . $thumbMedium->filename() ?> <?php echo $thumbMedium->width() ?>w, <?php echo c::get('pathThumbs') . '/' . $thumbSmall->filename() ?> <?php echo $thumbSmall->width() ?>w", "sizes": "100vw", "alt": "" }'>
                <div class="aspect-ratio" style="padding-bottom: <?php echo ($thumbLarge->height() / $thumbLarge->width()) * 100 ?>%;"></div>
                <img src="<?php echo c::get('pathThumbs') . '/' . $thumbMicro->filename() ?>" crossorigin="anonymous" aria-hidden="true" class="placeholder" alt="">
                <canvas width="<?php echo $thumbLarge->width() ?>" height="<?php echo $thumbLarge->height() ?>"></canvas>
                <noscript>
                    <img src="<?php echo c::get('pathThumbs') . '/' . $thumbSmall->filename() ?>" srcset="<?php echo c::get('pathThumbs') . '/' . $thumbLarge->filename() ?> <?php echo $thumbLarge->width() ?>w, <?php echo c::get('pathThumbs') . '/' . $thumbMedium->filename() ?> <?php echo $thumbMedium->width() ?>w, <?php echo c::get('pathThumbs') . '/' . $thumbSmall->filename() ?> <?php echo $thumbSmall->width() ?>w" sizes="100vw" alt="">
                </noscript>
            </div>
        <div class="info">
            <?php echo $about->text()->kirbytext() ?>
        </div>
    </div>
</section>
