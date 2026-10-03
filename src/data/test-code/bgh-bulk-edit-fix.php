<?php
// includes/admin/product-ui.php
add_action('load-edit.php', function () {
    if (empty($_GET['bulk_edit']) || empty($_GET['post'])) {
        return;
    }

    // Хук срабатывает раньше, чем ядро проверит nonce списка.
    // Без своей проверки чужая ссылка, открытая сотрудником,
    // переводила товары в «Под заказ» и стирала им цены.
    check_admin_referer('bulk-posts');

    $state = sanitize_key(wp_unslash($_GET['bgh_stock_state'] ?? ''));
    // ...
});
