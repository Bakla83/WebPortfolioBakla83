<?php
// includes/request-submit.php
function bgh_request_fingerprint($data)
{
    return md5(implode('|', array(
        $data['phone']['e164'],
        $data['kind'],
        $data['note'],
        implode(',', $data['goals']),
        // Было: implode(',', $data['items']). Позиции приходят массивами,
        // и любая подборка из двух товаров превращалась в «Array,Array».
        implode(',', array_map('intval', array_column((array) $data['items'], 'id'))),
    )));
}
