<?php
// المسار: /htdocs/api/helpers.php

function jsonResponse($statusCode, $data) {
    // تنظيف البافر عشان ميبقاش فيه أي HTML زيادة
    ob_clean(); 
    
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}