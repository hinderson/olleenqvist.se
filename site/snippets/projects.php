<section class="section section-projects">
    <header>
        <h2 class="visuallyhidden">Projects</h2>
    </header>
    <div class="group">
        <div class="group-inner">
            <?php foreach($projects as $project): ?>
                <?php snippet('project', compact('project')); ?>
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
