<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

// Check for JWT
if (!isset($_COOKIE['jwt'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$jwt = $_COOKIE['jwt'];
$key = "Aceasta este o cheie ultra secreta";

try {
    $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $email = $decoded->email ?? null;
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

if (!$email) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Fetch user ID from database
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'User not found']);
    exit;
}

$user_id = $user['id'];
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'No data provided']);
    exit;
}

function toBool($value) {
    return ($value === 'yes' || $value === true || $value === 'true' || $value === 1 || $value === '1');
}


$stmt = $pdo->prepare("INSERT INTO matrix_generator_inputs (
    user_id, matrix_rows, matrix_cols, matrix_map, matrix_min, matrix_max,
    matrix_parity, matrix_unique, matrix_sign
) VALUES (
    :user_id, :matrix_rows, :matrix_cols, :matrix_map, :matrix_min, :matrix_max,
    :matrix_parity, :matrix_unique, :matrix_sign
)");

try {
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindValue(':matrix_rows', $data['rows'], PDO::PARAM_INT);
    $stmt->bindValue(':matrix_cols', $data['cols'], PDO::PARAM_INT);
    $stmt->bindValue(':matrix_map', toBool($data['map']), PDO::PARAM_BOOL);
    $stmt->bindValue(':matrix_min', $data['min'], PDO::PARAM_INT);
    $stmt->bindValue(':matrix_max', $data['max'], PDO::PARAM_INT);
    $stmt->bindValue(':matrix_parity', $data['parity'], PDO::PARAM_STR);
    $stmt->bindValue(':matrix_unique', toBool($data['unique']), PDO::PARAM_BOOL);
    $stmt->bindValue(':matrix_sign', $data['sign'], PDO::PARAM_STR);

    $stmt->execute();

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
