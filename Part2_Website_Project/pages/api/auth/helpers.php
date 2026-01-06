<?php
// Dir: /htdocs/api/helpers.php

function jsonResponse($statusCode, $data) {
    // Clean the buffer so that it doesn't contain any extra HTML.
    ob_clean(); 
    
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}