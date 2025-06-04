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

$stmt = $pdo->prepare("INSERT INTO tree_generator_inputs (
    user_id, tree_nodes, tree_binary, tree_lvl, tree_weighted, tree_min_weight, tree_max_weight, created_at
) VALUES (
    :user_id, :tree_nodes, :tree_binary, :tree_lvl, :tree_weighted, :tree_min_weight, :tree_max_weigh,t now()
)");

try {
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindValue(':tree_nodes', $data['nodes'], PDO::PARAM_INT);
    $stmt->bindValue(':tree_binary', toBoolOrNull($data['binary']), is_null(toBoolOrNull($data['binary'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
    $stmt->bindValue(':tree_lvl', $data['lvl'], PDO::PARAM_INT);
    $stmt->bindValue(':tree_weighted', toBoolOrNull($data['weighted']), is_null(toBoolOrNull($data['weighted'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
    $stmt->bindValue(':tree_min_weight', $data['minWeight']);
    $stmt->bindValue(':tree_max_weight', $data['maxWeight']);

    $stmt->execute();

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
