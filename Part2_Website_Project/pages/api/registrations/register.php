<?php
// المسار: /htdocs/api/registrations/register.php

ini_set('display_errors', 0);
header("Content-Type: application/json; charset=UTF-8");

session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => '',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Please login first']);
    exit;
}

$userId = $_SESSION['user']['id'];
$data = json_decode(file_get_contents("php://input"), true);

$eventKey = trim($data['eventKey'] ?? $data['eventName'] ?? '');
$eventName = trim($data['eventName'] ?? $data['eventKey'] ?? '');

if (!$eventKey) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing event name']);
    exit;
}

$db_host = 'sql306.infinityfree.com';
$db_name = 'if0_40805578_eventsx';
$db_user = 'if0_40805578';
$db_pass = 'Ehjn27LnLVjxy';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $check = $pdo->prepare("SELECT id FROM registrations WHERE user_id = ? AND (event_key = ? OR event_name = ?)");
    $check->execute([$userId, $eventKey, $eventName]);

    if ($check->fetch()) {
        echo json_encode(['ok' => true, 'message' => 'Already registered']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO registrations (user_id, event_key, event_name, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$userId, $eventKey, $eventName]);

    echo json_encode(['ok' => true, 'message' => 'Registered successfully']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()]);
}
?>
