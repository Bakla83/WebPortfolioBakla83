<?php
// tools/price-sync-test.php, раздел «Запись цены и наличия».
// Товар и его метаполя живут в памяти, WooCommerce не нужен.

function sync_case($state, $price, $partner, $stock)
{
    static $id = 100;

    $id++;
    $GLOBALS['bgh_meta'][$id] = array('_bgh_stock_state' => $state);

    $product = new BghTestProduct($id, $price);
    bgh_price_write($product, $partner, $stock);

    return array(bgh_get_stock_state($id), $product->get_regular_price());
}

// Шесть переходов: состояние на сайте × наличие у партнёра.
same('Москва, у партнёра есть: новая цена', sync_case('moscow', '100000', 120000.0, 'in'), array('moscow', '120000'));
same('Москва, у партнёра кончилось: под заказ без цены', sync_case('moscow', '100000', 120000.0, 'out'), array('order', ''));
same('под заказ, у партнёра появилось: Москва с ценой', sync_case('order', '', 120000.0, 'in'), array('moscow', '120000'));
same('под заказ, у партнёра нет: цена не появляется', sync_case('order', '', 120000.0, 'out'), array('order', ''));
same('под заказ, наличие у партнёра не размечено: цена не появляется', sync_case('order', '', 120000.0, ''), array('order', ''));
same('Краснодар не трогается, цена обновляется', sync_case('krasnodar', '100000', 120000.0, 'out'), array('krasnodar', '120000'));
