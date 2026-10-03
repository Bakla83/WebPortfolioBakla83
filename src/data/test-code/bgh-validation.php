<?php
// tools/request-test.php, разделы «Телефон», «Имя и комментарий», «Метка времени».

echo "Телефон\n";
$phone = bgh_normalize_phone('8 (918) 000-11-22');
check('восьмёрка в начале становится +7', $phone['ok'] && '+79180001122' === $phone['e164']);
check('десять цифр без кода страны', '+79180001122' === bgh_normalize_phone('9180001122')['e164']);
check('номер Казахстана отклоняется', !bgh_normalize_phone('+7 701 000-11-22')['ok']);
check('номер другой страны отклоняется', !bgh_normalize_phone('+995 599 20 93 47')['ok']);
check('несуществующий код отклоняется', !bgh_normalize_phone('+7 118 000-11-22')['ok']);
check('одна цифра десять раз отклоняется', !bgh_normalize_phone('+7 999 999-99-99')['ok']);

echo "\nИмя и комментарий\n";
check('имя из одной буквы отклоняется', !bgh_clean_name('А')['ok']);
check('ссылка в имени отклоняется', !bgh_clean_name('www.spam.ru')['ok']);
check('домен без http тоже считается ссылкой', !bgh_clean_note('пишите на sale.ru')['ok']);
check('размеры комнаты с точками проходят', bgh_clean_note('Гостиная 4.5 на 6 м, диван 2.8')['ok']);

echo "\nМетка времени\n";
// Метка подписана HMAC: время отправки нельзя подделать в браузере.
function fresh_stamp($age = 60)
{
    $time = time() - $age;

    return $time . '.' . hash_hmac('sha256', (string) $time, bgh_form_salt());
}

check('метка минутной давности проходит', true === bgh_form_stamp_check(fresh_stamp(60)));
check('отправка быстрее трёх секунд отклоняется', true !== bgh_form_stamp_check(bgh_form_stamp()));
check('метка старше суток отклоняется', true !== bgh_form_stamp_check(fresh_stamp(DAY_IN_SECONDS + 60)));
check('подделанная подпись отклоняется', true !== bgh_form_stamp_check((time() - 60) . '.' . str_repeat('0', 64)));
