<?php
// Path: /htdocs/api/events.php

// 1. Recalling the central connection file
require_once 'db_connect.php';

// 2. Setting up a JSON response
header('Content-Type: application/json; charset=UTF-8');

try {
    // Obtaining a database connection
    $pdo = getDBConnection();

    // 3. Retrieve data from the events table

    $stmt = $pdo->query("SELECT id, name, category, date, location, cost, image FROM events ORDER BY id DESC");
    $events = $stmt->fetchAll();

    // 4. Sending data to JavaScript
    echo json_encode([
        'ok' => true,
        'events' => $events
    ]);

} catch (Exception $e) {
    // In case an error occurs
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'فشل في جلب البيانات من قاعدة البيانات: ' . $e->getMessage()
    ]);
}
?>