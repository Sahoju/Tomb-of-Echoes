<?php
    // getmessages.php, solely for the purpose of getting all messages for the initialization
    require_once 'db_fns.php';

    $fns = new Init();
    $texts = $fns->getTexts();
    echo json_encode($texts);
?>