<?php
    $files = scandir('../img');
    echo json_encode($files);
?>