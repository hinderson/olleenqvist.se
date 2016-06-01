<!DOCTYPE html>
<html lang="en" class="no-js page-<?php echo $page->template() ?>">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0">

    <title><?php echo $site->title()->html() ?><?php if (!$page->isHomePage()) { echo " | " . $page->title()->html(); } ?></title>
    <script>document.documentElement.className = document.documentElement.className.replace(/(^|\\\b)no-js(\b|$)/, 'js');if (!("ontouchstart" in document.documentElement)) {document.documentElement.className += " no-touch";}</script>

    <meta name="description" content="<?php echo $site->description()->html() ?>">

    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?php echo $site->pageTitle()->text() ?>" />
    <meta property="og:description" content="<?php echo $site->description()->html() ?>" />
    <meta property="og:url" content="https://www.olleenqvist.se/" />
    <meta property="og:site_name" content="<?php echo $site->pageTitle()->text() ?>" />
    <?php if ($image = $site->images()->first()) : ?>
        <meta property="og:image" content="<?php echo c::get('pathThumbs') . '/' . thumb($image, array('width' => 1200, 'height' => 630, 'crop' => true))->filename(); ?>" />
    <?php endif ?>

    <?php echo css('dist/css/main.css') ?>
</head>
<body>
    <header class="header cf" role="banner">
        <a href="<?php echo url() ?>" class="visuallyhidden">
            <h1>Olle Enqvist</h1>
        </a>

        <nav role="navigation" class="nav-main">
            <div class="view-toggler">
                <button>
                    <span class="chard-left"><?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-faceted-left.svg') ?></span>
                    <span class="chard-right"><?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-faceted-right.svg') ?></span>
                    <span class="label">Stack view</span>
                </button>
            </div>
            <div class="info-toggler">
                <button>
                    <span class="chard-left"><?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-faceted-left.svg') ?></span>
                    <span class="chard-right"><?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-faceted-right.svg') ?></span>
                    <span class="label">Olle Enqvist</span>
                </button>
            </div>
        </nav>
    </header>
