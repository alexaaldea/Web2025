<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

ini_set('display_errors', 0);   // Do not output errors to client
ini_set('log_errors', 1);       // Log errors to server log
ini_set('error_log', __DIR__ . '/error.log'); // Customize log file path
error_reporting(E_ALL);

header('Content-Type: application/json');

if(!isset($_COOKIE['jwt'])){
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
    return null; 
}

$stmt = $pdo->prepare("INSERT INTO string_generator_inputs (
    user_id, string_min, string_max, same_length, include_prefix, include_suffix,
    sorting, string_unique, string_letter, string_count
) VALUES (
    :user_id, :string_min, :string_max, :same_length, :include_prefix, :include_suffix,
    :sorting, :string_unique, :string_letter, :string_count
)");

try {
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindValue(':string_min', isset($data['stringMin']) ? $data['stringMin'] : null, PDO::PARAM_INT);
    $stmt->bindValue(':string_max', isset($data['stringMax']) ? $data['stringMax'] : null, PDO::PARAM_INT);
    $stmt->bindValue(':same_length', isset($data['sameLength']) ? $data['sameLength'] : null, PDO::PARAM_INT);
    $stmt->bindValue(':include_prefix', $data['includePrefix'] ?? null, PDO::PARAM_STR);
    $stmt->bindValue(':include_suffix', $data['includeSuffix'] ?? null, PDO::PARAM_STR);
    $stmt->bindValue(':sorting', $data['sorting'] ?? null, PDO::PARAM_STR);
    $stmt->bindValue(':string_unique', toBoolOrNull($data['stringUnique']), is_null(toBoolOrNull($data['stringUnique'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
    $stmt->bindValue(':string_letter', $data['stringLetter'] ?? null, PDO::PARAM_STR);
    $stmt->bindValue(':string_count', isset($data['stringCount']) ? $data['stringCount'] : null, PDO::PARAM_INT);

    $stmt->execute();

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
