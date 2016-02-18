<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0">

    <title><?php echo $site->title()->html() ?> | <?php echo $page->title()->html() ?></title>
    <meta name="description" content="<?php echo $site->description()->html() ?>">

    <?php echo css('dist/css/main.css') ?>
</head>
<body>
    <header class="header cf" role="banner">
        <a class="logo" href="<?php echo url() ?>">
            <h1>Olle Enqvist</h1>
        </a>
    </header>
