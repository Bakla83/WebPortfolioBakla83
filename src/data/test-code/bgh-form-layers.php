<?php
// tools/request-test.php, раздел «Слои защиты формы».

reset_store();
$reply = send(form(array('email' => 'bot@example.com')));
check('ловушка: ответ такой же, как при успехе', true === $reply->ok);
check('ловушка: заявки нет и письмо не ушло', !$store['posts'] && !$store['mail']);
check('ловушка: попытка записана в журнал', 'заполнено скрытое поле' === last_reject(), last_reject());

reset_store();
$reply = send(form(array('nonce' => 'bad')));
check('чужой nonce отклоняется', false === $reply->ok && !$store['posts']);

reset_store();
$reply = send(form(array('stamp' => bgh_form_stamp())));
check('отправка сразу после загрузки отклоняется', false === $reply->ok && !$store['posts']);

reset_store();
$reply = send(form(array('note' => 'подробности на https://spam.example')));
check('ссылка в комментарии: отказ с подсветкой поля', false === $reply->ok && 'note' === $reply->data['field']);

reset_store();
$reply = send(form(array('agree' => '')));
check('без согласия заявка не уходит', false === $reply->ok && 'agree' === $reply->data['field']);

reset_store();
foreach (array('+7 918 000-11-01', '+7 918 000-11-02', '+7 918 000-11-03') as $number) {
    send(form(array('phone' => $number)));
}
$reply = send(form(array('phone' => '+7 918 000-11-04')));
check('первые три заявки с одного адреса дошли', 3 === count($store['posts']), 'записей: ' . count($store['posts']));
check('четвёртая за час: вежливый отказ с телефоном салона',
    false === $reply->ok && false !== strpos($reply->data['message'], '+7 918 657-50-27'));
