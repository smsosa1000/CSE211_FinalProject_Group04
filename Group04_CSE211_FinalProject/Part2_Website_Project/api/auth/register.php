<?php
// المسار: /htdocs/api/auth/register.php

// استدعاء ملف الاتصال المركزي الجديد
require_once __DIR__ . '/../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// استقبال البيانات وتنظيفها
$username = trim($data['username'] ?? '');
$name = trim($data['fullname'] ?? $data['name'] ?? ''); // دعم الاسمين
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$phone = trim($data['phone'] ?? '');

// 1. التحقق من البيانات (Validation)
if (!$username || !$name || !$email || !$password) {
    echo json_encode(['ok' => false, 'error' => 'Please fill all required fields']);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode(['ok' => false, 'error' => 'Password must be at least 8 characters']);
    exit;
}

try {
    $pdo = getDBConnection();

    // 2. التأكد إن الإيميل أو اليوزرنيم مش مستخدم قبل كدة
    $check = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    $check->execute([$email, $username]);
    if ($check->fetch()) {
        echo json_encode(['ok' => false, 'error' => 'Username or Email already exists']);
        exit;
    }

    // 3. تشفير الباسورد وحفظ المستخدم
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (username, name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$username, $name, $email, $phone, $hashed]);

    // 4. تسجيل الدخول أوتوماتيك بعد إنشاء الحساب
    $newId = $pdo->lastInsertId();
    $_SESSION['user'] = [
        'id' => $newId,
        'username' => $username,
        'name' => $name,
        'email' => $email,
        'role' => 'user'
    ];

    echo json_encode(['ok' => true, 'message' => 'Account created successfully', 'user' => $_SESSION['user']]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Registration failed due to system error']);
}
?>