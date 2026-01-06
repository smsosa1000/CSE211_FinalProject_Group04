<?php



require_once 'db_connect.php';


header('Content-Type: application/json; charset=UTF-8');

try {

    $pdo = getDBConnection();



    $stmt = $pdo->query("SELECT id, name, category, date, location, cost, image FROM events ORDER BY id DESC");
    $events = $stmt->fetchAll();


    echo json_encode([
        'ok' => true,
        'events' => $events
    ]);

} catch (Exception $e) {

    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'فشل في جلب البيانات من قاعدة البيانات: ' . $e->getMessage()
    ]);
}
?>
