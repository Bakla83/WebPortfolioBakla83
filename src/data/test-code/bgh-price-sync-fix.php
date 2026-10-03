<?php
// includes/price-sync.php, bgh_price_write()
if ('out' === $stock && 'moscow' === $state) {
    // ... перевод в «Под заказ» и очистка цены
    return true;
}

// Позиция под заказ получает цену только вместе с наличием у партнёра.
// Раньше сочетания «под заказ + нет» и «под заказ + неизвестно»
// проваливались в общую ветку записи цены.
if ('order' === $state && 'in' !== $stock) {
    return false;
}

if (abs($value - $current) >= 0.5) {
    $price = wc_format_decimal($value);
    $product->set_regular_price($price);
    // ...
}
