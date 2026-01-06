<?php
// المسار: /htdocs/api/auth/me.php

// استدعاء ملف الاتصال المركزي (عشان يظبط السيشن زي login.php بالظبط)
require_once __DIR__ . '/../db_connect.php';

// التحقق من وجود المستخدم في الجلسة
if (isset($_SESSION['user'])) {
    // لو موجود، ابعت بياناته للداشبورد
    echo json_encode(['ok' => true, 'user' => $_SESSION['user']]);
} else {
    // لو مش موجود
    echo json_encode(['ok' => false, 'user' => null]);
}
?>