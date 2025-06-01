<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


header('Content-Type: application/json');

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

function toBoolOrNull($value) {
    if ($value === 'true' || $value === true || $value === 1 || $value === '1') return true;
    if ($value === 'false' || $value === false || $value === 0 || $value === '0') return false;
    return null;
}

$stmt = $pdo->prepare("INSERT INTO vector_generator_inputs (
    user_id, vector_length, vector_min, vector_max, vector_parity, vector_sign,
    vector_type, vector_unique, vector_palindrome, vector_line, vector_sorted
) VALUES (
    :user_id, :vector_length, :vector_min, :vector_max, :vector_parity, :vector_sign,
    :vector_type, :vector_unique, :vector_palindrome, :vector_line, :vector_sorted
)");

try {
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindValue(':vector_length', $data['length'], PDO::PARAM_INT);
    $stmt->bindValue(':vector_min', $data['min']);
    $stmt->bindValue(':vector_max', $data['max']);
    $stmt->bindValue(':vector_parity', $data['parity']);
    $stmt->bindValue(':vector_sign', $data['sign']);
    $stmt->bindValue(':vector_type', $data['type']);
    $stmt->bindValue(':vector_unique', toBoolOrNull($data['unique']), PDO::PARAM_BOOL);
    $stmt->bindValue(':vector_palindrome', toBoolOrNull($data['palindrome']), PDO::PARAM_BOOL);
    $stmt->bindValue(':vector_line', $data['line'], PDO::PARAM_INT);
    $stmt->bindValue(':vector_sorted', $data['sorted']);

    $stmt->execute();

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
