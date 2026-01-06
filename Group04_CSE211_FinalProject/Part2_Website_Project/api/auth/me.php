<?php



require_once __DIR__ . '/../db_connect.php';


if (isset($_SESSION['user'])) {

    echo json_encode(['ok' => true, 'user' => $_SESSION['user']]);
} else {

    echo json_encode(['ok' => false, 'user' => null]);
}
?>
