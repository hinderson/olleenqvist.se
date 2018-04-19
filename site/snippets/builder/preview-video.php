<?php
    $url = $data->_fileUrl->value;
    $placeholder = $data->placeholder()->value;
    $placeholderType = pathinfo($placeholder)['extension'];
    $embedUrl = $data->video->value;
?>
<div style="display: table; width: 100%;">
    <div style="float: left; position: relative; overflow: hidden; width: 50px; height: 50px; vertical-align: top; margin-right: 10px;">
        <?php if ($placeholderType == 'mp4'): ?>
            <video autoplay muted loop src="<?= $url . $placeholder ?>" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"></video>
        <?php else: ?>
            <div style="float: left; width: 50px; height: 50px; vertical-align: top; margin-right: 10px; background-image: url(<?= $url . $placeholder ?>); background-position: 50% 50%; background-size: cover;"></div>
        <?php endif; ?>
    </div>
    <strong><?= $placeholder ?></strong><br>
</div>
