<?php
// tools/bulk-edit-test.php
// Обработчик висит на load-edit.php, здесь его вызывают напрямую.

// Настоящая check_admin_referer при неудаче обрывает запрос.
function check_admin_referer($action)
{
    if (!isset($_REQUEST['_wpnonce']) || 'nonce:' . $action !== $_REQUEST['_wpnonce']) {
        throw new Stop($action);
    }

    return 1;
}

function run_list_screen($query)
{
    $_GET     = $query;
    $_REQUEST = $query;

    try {
        foreach ($GLOBALS['hooks']['load-edit.php'] as $callback) {
            $callback();
        }
    } catch (Stop $stop) {
        return 'остановлен';
    }

    return 'выполнен';
}

$forged = array(
    'post_type'       => 'product',
    'bulk_edit'       => '1',
    'post'            => array('11', '12'),
    'bgh_stock_state' => 'order',
);

echo "Подделанная ссылка\n";
catalog();
$result = run_list_screen($forged);
check('без nonce списка запрос обрывается', 'остановлен' === $result, $result);
check('наличие у товаров не поменялось',
    'krasnodar' === get_post_meta(11, '_bgh_stock_state', true) && 'moscow' === get_post_meta(12, '_bgh_stock_state', true));

echo "\nНастоящая групповая правка\n";
catalog();
$result = run_list_screen($forged + array('bgh_lead' => '10–12 недель', '_wpnonce' => 'nonce:bulk-posts'));
check('с nonce списка правка проходит', 'выполнен' === $result, $result);
check('наличие поменялось у отмеченных',
    'order' === get_post_meta(11, '_bgh_stock_state', true) && 'order' === get_post_meta(12, '_bgh_stock_state', true));

echo "\nПрава\n";
catalog();
run_list_screen(array('post' => array('13')) + $forged + array('_wpnonce' => 'nonce:bulk-posts'));
check('товар без права на правку не меняется', 'moscow' === get_post_meta(13, '_bgh_stock_state', true));
