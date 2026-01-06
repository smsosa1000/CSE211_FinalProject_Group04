<?php
ini_set('display_errors', 0);
header("Content-Type: application/json; charset=UTF-8");

session_set_cookie_params(['lifetime' => 86400, 'path' => '/', 'secure' => false, 'httponly' => true, 'samesite' => 'Lax']);
session_start();

if (!isset($_SESSION['user'])) { 
    http_response_code(401); 
    echo json_encode(['ok' => false, 'error' => 'Login required']); 
    exit; 
}

$userId = $_SESSION['user']['id'];

try {
    $pdo = new PDO("mysql:host=sql306.infinityfree.com;dbname=if0_40805578_eventsx;charset=utf8mb4", "if0_40805578", "Ehjn27LnLVjxy");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT event_name, event_key, created_at FROM registrations WHERE user_id = ? ORDER BY created_at DESC LIMIT 20");
    $stmt->execute([$userId]);
    
    echo json_encode(['ok' => true, 'registrations' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
