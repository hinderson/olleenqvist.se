<!DOCTYPE html>
<html lang="en" class="no-js page-<?php echo $page->template() ?>">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0">

    <title><?php echo $site->title()->html() ?><?php if (!$page->isHomePage()) { echo " | " . $page->title()->html(); } ?></title>
    <script>document.documentElement.className = document.documentElement.className.replace(/(^|\\\b)no-js(\b|$)/, 'js');if (!("ontouchstart" in document.documentElement)) {document.documentElement.className += " no-touch";}</script>

    <link rel="icon" type="image/png" href="<?php echo c::get('pathAssets') ?>/images/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="<?php echo c::get('pathAssets') ?>/images/favicon-16x16.png" sizes="16x16" />

    <meta name="description" content="<?php echo $site->description()->html() ?>">

    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?php echo $site->pageTitle()->text() ?>" />
    <meta property="og:description" content="<?php echo $site->description()->html() ?>" />
    <meta property="og:url" content="https://www.olleenqvist.se/" />
    <meta property="og:site_name" content="<?php echo $site->pageTitle()->text() ?>" />
    <?php if ($image = $site->images()->first()) : ?>
        <meta property="og:image" content="<?php echo thumb($image, array('width' => 1200, 'height' => 630, 'crop' => true))->url(); ?>" />
    <?php endif ?>

    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-34522585-1', 'auto');
        ga('send', 'pageview');
    </script>

    <?php if (c::get('debug')) : ?>
        <?php echo css('dist/css/main.css') ?>
    <?php else : ?>
        <?php
            $json = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/assets/rev-manifest.json');
            $manifest = json_decode($json, true);

            echo css('assets/' . $manifest['css/main.css']);
        ?>
    <?php endif; ?>
</head>
<body>
    <header class="site-header" role="banner">
        <h1 class="visuallyhidden">Olle Enqvist</h1>

        <button class="info-toggler">
            <span class="chard-left"><?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-faceted-left.svg') ?></span>
            <span class="chard-right"><?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-faceted-right.svg') ?></span>
            <span class="label">Olle Enqvist</span>
        </button>

        <nav class="nav-main">
            <ul class="category-switcher">
                <li><a href="#" class="category-photo is-selected">Photo</a></li>
                <li><a href="#" class="category-video">Video</a></li>
            </ul>
        </nav>

        <button class="view-toggler">
            <span class="chard-left"><?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-faceted-left.svg') ?></span>
            <span class="chard-right"><?php include($_SERVER['DOCUMENT_ROOT'] . '/assets/images/btn-faceted-right.svg') ?></span>
            <span class="label">Stack view</span>
        </button>
    </header>
