<?php snippet('header') ?>

<main class="main" role="main">
    <h1><?php echo $page->title()->html() ?></h1>

    <div class="text">
      <?php echo $page->text()->kirbytext() ?>

      <?php foreach($page->images()->sortBy('sort', 'asc') as $image): ?>
          <?php
              $thumbGigantic = thumb($page->images()->first(), array('width' => 1500, 'quality' => 100));
              $thumbLarge = thumb($page->images()->first(), array('width' => 980, 'quality' => 100));
              $thumbMedium = thumb($page->images()->first(), array('width' => 860, 'quality' => 90));
              $thumbSmall = thumb($page->images()->first(), array('width' => 440, 'quality' => 85));
          ?>
          <img src="<?php echo $thumbMedium->url() ?>" srcset="<?php echo $thumbLarge->url() ?> <?php echo $thumbLarge->width() ?>w, <?php echo $thumbMedium->url() ?> <?php echo $thumbMedium->width() ?>w, <?php echo $thumbSmall->url() ?> <?php echo $thumbSmall->width() ?>w" sizes="100vw" alt="<?php echo $page->title()->html() ?>">
      <?php endforeach ?>
    </div>

    <nav class="nextprev cf" role="navigation">
        <?php if($prev = $page->prevVisible()): ?>
        <a class="prev" href="<?php echo $prev->url() ?>">&larr; previous</a>
        <?php endif ?>
        <?php if($next = $page->nextVisible()): ?>
        <a class="next" href="<?php echo $next->url() ?>">next &rarr;</a>
        <?php endif ?>
    </nav>
</main>

<?php snippet('footer') ?>
