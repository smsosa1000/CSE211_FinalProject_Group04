<?php



require_once __DIR__ . '/../db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);


$username = trim($data['username'] ?? '');
$name = trim($data['fullname'] ?? $data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$phone = trim($data['phone'] ?? '');


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


    $check = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    $check->execute([$email, $username]);
    if ($check->fetch()) {
        echo json_encode(['ok' => false, 'error' => 'Username or Email already exists']);
        exit;
    }


    $hashed = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (username, name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$username, $name, $email, $phone, $hashed]);


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
