<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Get JWT from cookie
$jwt = $_COOKIE['jwt'] ?? '';

if (!$jwt) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized: No token']);
    exit;
}

$key = "Aceasta este o cheie ultra secreta";

try {
    // Decode and verify token
    $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $email = $decoded->email ?? null;

    if (!$email) {
        throw new Exception('Invalid token payload');
    }

    // Lookup user_id by email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    $user_id = $user['id'];

    // Get stats from view
    $stmt = $pdo->prepare("SELECT * FROM user_input_statistics_view WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $user_id]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$stats) {
        echo json_encode(['error' => 'No statistics found']);
        exit;
    }

    echo json_encode($stats);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token', 'details' => $e->getMessage()]);
}
