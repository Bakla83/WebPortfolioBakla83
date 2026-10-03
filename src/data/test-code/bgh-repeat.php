<?php
// tools/request-test.php, раздел «Повторная отправка».
// send() вызывает настоящий обработчик формы на заглушках WordPress,
// $store держит в памяти заявки и письма вместо базы и почты.

reset_store();
$first = send(form());
check('заявка записана и ушла письмом', true === $first->ok && 1 === count($store['posts']) && 1 === count($store['mail']));

$again = send(form());
check('та же заявка второй раз не заводит карточку и письмо',
    true === $again->ok && 1 === count($store['posts']) && 1 === count($store['mail']));
check('у первой заявки растёт счётчик повторов', 1 === (int) get_post_meta(1, '_bgh_repeats', true));

reset_store();
send(form(array('items' => '11,12')));
$other = send(form(array('items' => '40,41')));
check('другая подборка того же человека становится новой заявкой',
    true === $other->ok && 2 === count($store['posts']), 'записей: ' . count($store['posts']));
check('письмо о второй подборке ушло в салон', 2 === count($store['mail']), 'писем: ' . count($store['mail']));

$base = array('phone' => array('e164' => '+79180001122'), 'kind' => 'podborka', 'note' => '', 'goals' => array());
check('отпечаток различает состав подборки',
    bgh_request_fingerprint($base + array('items' => bgh_request_items('11,12')))
    !== bgh_request_fingerprint($base + array('items' => bgh_request_items('40,41'))));

echo "\nПредупреждения PHP\n";
check('за прогон ни одного предупреждения', !$warnings, implode('; ', array_slice(array_unique($warnings), 0, 2)));
