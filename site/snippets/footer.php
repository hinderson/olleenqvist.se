    <footer class="footer cf" role="contentinfo">
        <div class="group">
            <div class="group-inner">
                <div class="copyright">
                    <small>© <?php echo date("Y") ?> Olle Enqvist</small>
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

            echo js('assets/' . $manifest['js/common.js'], true);
            echo js('assets/' . $manifest['js/' . $page->template() . '.js'], true);
        }
    ?>
</body>
</html>
