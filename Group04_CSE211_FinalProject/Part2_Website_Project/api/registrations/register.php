<?php
// المسار: /htdocs/api/registrations/register.php

ini_set('display_errors', 0);
header("Content-Type: application/json; charset=UTF-8");

// تظبيط السيشن
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => '',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

// 1. التأكد من الدخول
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Please login first']);
    exit;
}

// استخراج بيانات المستخدم من الجلسة
$userId = $_SESSION['user']['id'];
$data = json_decode(file_get_contents("php://input"), true);

// استقبال اسم الايفنت (سواء جاي باسم eventKey أو eventName)
$eventKey = trim($data['eventKey'] ?? $data['eventName'] ?? '');
$eventName = trim($data['eventName'] ?? $data['eventKey'] ?? '');

// التأكد من وجود اسم الحدث
if (!$eventKey) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing event name']);
    exit;
}

// 2. الاتصال بقاعدة البيانات
$db_host = 'sql306.infinityfree.com';
$db_name = 'if0_40805578_eventsx';
$db_user = 'if0_40805578';
$db_pass = 'Ehjn27LnLVjxy';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 3. التحقق إذا كان المستخدم مسجل في نفس الحدث
    $check = $pdo->prepare("SELECT id FROM registrations WHERE user_id = ? AND (event_key = ? OR event_name = ?)");
    $check->execute([$userId, $eventKey, $eventName]);

    if ($check->fetch()) {
        // إذا كان مسجل بالفعل في الحدث
        echo json_encode(['ok' => true, 'message' => 'Already registered']);
        exit;
    }

    // 4. الحفظ في جدول registrations
    $stmt = $pdo->prepare("INSERT INTO registrations (user_id, event_key, event_name, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$userId, $eventKey, $eventName]);

    // إرسال استجابة بنجاح التسجيل
    echo json_encode(['ok' => true, 'message' => 'Registered successfully']);

} catch (PDOException $e) {
    // إذا حدث خطأ في الاتصال بقاعدة البيانات
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database Error: ' . $e->getMessage()]);
}
?>
