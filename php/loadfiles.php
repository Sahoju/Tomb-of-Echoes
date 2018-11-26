<?php
    $files = scandir('../img'); //scans the img directory for all image files
    echo json_encode($files); //encodes them in JSON for easy use in code
?>