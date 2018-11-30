<?php
    // writemessages.php
    // solely for the purposes of sending written text to database
    require_once 'db_fns.php';

    $fns = new Init();
    $fns->putText($_POST['x'], $_POST['y'], $_POST['content']);
?>