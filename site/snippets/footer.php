    <footer class="site-footer cf" role="contentinfo">
        <div class="group">
            <div class="group-inner">
                <div class="copyright">
                    <?php $email = $pages->visible()->find('about')->email(); ?>
                    <a href="mailto:<?php echo $email ?>" class="email"><?php echo $email ?></a>
                    <small>©<?php echo date("Y") ?> Olle Enqvist</small>
                </div>
            </div>
        </div>
    </footer>
    <?php
        if (c::get('debug')) {
            echo js('dist/js/main.js', true);
        } else {
            $json = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/assets/rev-manifest.json');
            $manifest = json_decode($json, true);

            echo js('assets/' . $manifest['js/main.js'], true);
        }
    ?>
</body>
</html>
