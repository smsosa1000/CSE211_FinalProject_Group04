<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: https://eventsx.infinityfreeapp.com");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'secure' => true, 
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

function getDBConnection() {
    $db_host = 'sql306.infinityfree.com';
    $db_name = 'if0_40805578_eventsx';
    $db_user = 'if0_40805578';
    $db_pass = 'Ehjn27LnLVjxy'; 

    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Database connection error']);
        exit;
    }
}
?>