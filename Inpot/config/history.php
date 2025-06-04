<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


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

function fetchAll($pdo, $query, $params = []) {
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

$data = [
    'number' => [],
    'string' => [],
    'vector' => [],
    'matrix' => [],
    'graph' => [],
    'tree' => []
];

$numberRows = fetchAll($pdo, "SELECT id, created_at, min_value, max_value, count, parity, unique_numbers FROM number_generator_inputs WHERE user_id = :user_id", ['user_id' => $user_id]);
foreach ($numberRows as $row) {
    $data['number'][]=[
        'id' => $row['id'],
        'created_at' => $row['created_at'],
        'input'=> "Min: {$row['min_value']}, Max: {$row['max_value']}, Count: {$row['count']}, Parity: {$row['parity']}, Unique: " . ($row['unique_numbers'] ? 'true' : 'false')
    ];
}

$stringRows = fetchAll($pdo, "SELECT id, created_at, string_min, string_max, include_prefix, string_count, string_unique FROM string_generator_inputs WHERE user_id = :user_id", ['user_id' => $user_id]);
foreach ($stringRows as $row) {
    $data['string'][] = [
        'id' => $row['id'],
        'created_at' => $row['created_at'],
        'input' => "MinLen: {$row['string_min']}, MaxLen: {$row['string_max']}, Count: {$row['string_count']}, Prefix: \"{$row['include_prefix']}\", Unique: " . ($row['string_unique'] ? 'true' : 'false')
    ];
}

$vectorRows = fetchAll($pdo, "SELECT id, created_at, vector_length, vector_min, vector_max, vector_type, vector_sorted FROM vector_generator_inputs WHERE user_id = :user_id", ['user_id' => $user_id]);
foreach ($vectorRows as $row) {
    $data['vector'][] = [
        'id' => $row['id'],
        'created_at' => $row['created_at'],
        'input' => "Length: {$row['vector_length']}, Min: {$row['vector_min']}, Max: {$row['vector_max']}, Type: {$row['vector_type']}, Sorted: {$row['vector_sorted']}"
    ];
}

$matrixRows = fetchAll($pdo, "SELECT id, created_at, matrix_rows, matrix_cols, matrix_min, matrix_max, matrix_parity, matrix_unique FROM matrix_generator_inputs WHERE user_id = :user_id", ['user_id' => $user_id]);
foreach ($matrixRows as $row) {
    $data['matrix'][] = [
        'id' => $row['id'],
        'created_at' => $row['created_at'],
        'input' => "{$row['matrix_rows']}x{$row['matrix_cols']}, Min: {$row['matrix_min']}, Max: {$row['matrix_max']}, Parity: {$row['matrix_parity']}, Unique: " . ($row['matrix_unique'] ? 'true' : 'false')
    ];
}
header('Content-Type: application/json');
echo json_encode($data);
exit;