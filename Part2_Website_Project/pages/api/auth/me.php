<?php
// Dir: /htdocs/api/auth/me.php

// Retrieve the central connection file (to configure the session exactly like login.php)
require_once __DIR__ . '/../db_connect.php';

// Verify user presence in session
if (isset($_SESSION['user'])) {
    // If it exists, send its details to the dashboard.
    echo json_encode(['ok' => true, 'user' => $_SESSION['user']]);
} else {
    // If it is not there
    echo json_encode(['ok' => false, 'user' => null]);
}
?>