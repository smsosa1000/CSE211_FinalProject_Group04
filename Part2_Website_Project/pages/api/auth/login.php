<?php
// Dir: /htdocs/api/auth/login.php

// Attempting to retrieve the connection file (going back one step from auth to api)
$dbPath = __DIR__ . '/../db_connect.php';

if (!file_exists($dbPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database configuration file missing']);
    exit;
}

require_once $dbPath;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$login = trim($data['login'] ?? '');
$password = $data['password'] ?? '';

if (!$login || !$password) {
    echo json_encode(['ok' => false, 'error' => 'Missing credentials']);
    exit;
}

try {
    $pdo = getDBConnection();

    // User search
    $stmt = $pdo->prepare("SELECT id, username, name, email, role, password_hash FROM users WHERE email = ? OR username = ?");
    $stmt->execute([$login, $login]);
    $user = $stmt->fetch();

    // Password verification
    if ($user && password_verify($password, $user['password_hash'])) {
        // Renew the session
        session_regenerate_id(true);
        
        $_SESSION['user'] = [
            'id' => $user['id'],
            'username' => $user['username'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ];

        echo json_encode(['ok' => true, 'user' => $_SESSION['user']]);
    } else {
        echo json_encode(['ok' => false, 'error' => 'Invalid username or password']);
    }
} catch (Exception $e) {
    // In case of an error, we send a general message.
    echo json_encode(['ok' => false, 'error' => 'Login system error']);
}
?>