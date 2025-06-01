<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header('Content-Type: application/json');

if(!isset($_COOKIE['jwt'])){
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$jwt = $_COOKIE['jwt'];
$key = "Aceasta este o cheie ultra secreta";

try{
    $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $email = $decoded->email ?? null;
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

if(!$email){
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$user){
    http_response_code(401);
    echo json_encode(['error' => 'User not found']);
    exit;
}

$user_id = $user['id'];
$data = json_decode(file_get_contents('php://input'), true);

if(!$data){
    http_response_code(400);
    echo json_encode(['error' => 'No data provided']);
    exit;
}

function toBoolOrNull($value) {
    if ($value === 'true' || $value === true || $value === 1 || $value === '1') return true;
    if ($value === 'false' || $value === false || $value === 0 || $value === '0') return false;
    return false; 
}

$stmt = $pdo->prepare("INSERT INTO number_generator_inputs (
    user_id, min_value, max_value, count, parity, sign, sorted, data_type, unique_numbers, pattern, step,
    include_zero, include_min, include_max,
    edge_empty_input, edge_single_element, edge_all_equal
) VALUES (
    :user_id, :min_value, :max_value, :count, :parity, :sign, :sorted, :data_type, :unique_numbers, :pattern, :step,
    :include_zero, :include_min, :include_max,
    :edge_empty_input, :edge_single_element, :edge_all_equal
)");

try {
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':min_value', $data['min']);
$stmt->bindValue(':max_value', $data['max']);
$stmt->bindValue(':count', $data['count'], PDO::PARAM_INT);
$stmt->bindValue(':parity', $data['parity']);
$stmt->bindValue(':sign', $data['sign']);
$stmt->bindValue(':sorted', $data['sorted']);
$stmt->bindValue(':data_type', $data['type']);
$stmt->bindValue(':unique_numbers', toBoolOrNull($data['unique']), is_null(toBoolOrNull($data['unique'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
$stmt->bindValue(':pattern', $data['pattern']);
$stmt->bindValue(':step', $data['step']);
$stmt->bindValue(':include_zero', toBoolOrNull($data['includeZero']), is_null(toBoolOrNull($data['includeZero'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
$stmt->bindValue(':include_min', toBoolOrNull($data['includeMin']), is_null(toBoolOrNull($data['includeMin'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
$stmt->bindValue(':include_max', toBoolOrNull($data['includeMax']), is_null(toBoolOrNull($data['includeMax'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
$stmt->bindValue(':edge_empty_input', toBoolOrNull($data['edgeEmpty']), is_null(toBoolOrNull($data['edgeEmpty'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
$stmt->bindValue(':edge_single_element', toBoolOrNull($data['edgeSingle']), is_null(toBoolOrNull($data['edgeSingle'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
$stmt->bindValue(':edge_all_equal', toBoolOrNull($data['edgeAllEqual']), is_null(toBoolOrNull($data['edgeAllEqual'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);

$stmt->execute();

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
