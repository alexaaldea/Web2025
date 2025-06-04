<?php
require_once __DIR__ . '/db.php';

$email = $_POST['email'] ?? '';
$password = $_POST['pwd'] ?? '';
$first_name = $_POST['first-name'] ?? '';
$last_name = $_POST['last-name'] ?? '';

if (!$email || !$password || !$first_name || !$last_name) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required.']);
    exit;
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare('INSERT INTO users (first_name, last_name, email, password) VALUES (:first_name, :last_name, :email, :password)');
    $stmt->execute([
        'first_name' => $first_name,
        'last_name' => $last_name,
        'email' => $email,
        'password' => $hashed_password
    ]);
    echo json_encode(['success' => 'User registered successfully!']);
} catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>