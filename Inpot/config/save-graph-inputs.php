<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    return false;
}

$stmt = $pdo->prepare("INSERT INTO graph_generator_inputs (
    user_id, graph_nodes, graph_edges, graph_oriented, graph_connected, graph_bipartit, graph_weighted, graph_min_weight, graph_max_weight, created_at
) VALUES (
    :user_id, :graph_nodes, :graph_edges, :graph_oriented, :graph_connected, :graph_bipartit, :graph_weighted, :graph_min_weight, :graph_max_weight, now()
)");

try {
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindValue(':graph_nodes', $data['nodes'], PDO::PARAM_INT);
    $stmt->bindValue(':graph_edges', $data['edges'], PDO::PARAM_INT);
    $stmt->bindValue(':graph_oriented', toBoolOrNull($data['oriented']), is_null(toBoolOrNull($data['oriented'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
    $stmt->bindValue(':graph_connected', toBoolOrNull($data['connected']), is_null(toBoolOrNull($data['connected'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
    $stmt->bindValue(':graph_bipartit', toBoolOrNull($data['bipartit']), is_null(toBoolOrNull($data['bipartit'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
    $stmt->bindValue(':graph_weighted', toBoolOrNull($data['weighted']), is_null(toBoolOrNull($data['weighted'])) ? PDO::PARAM_NULL : PDO::PARAM_BOOL);
    $stmt->bindValue(':graph_min_weight', $data['min_weight'], PDO::PARAM_INT);
    $stmt->bindValue(':graph_max_weight', $data['max_weight'], PDO::PARAM_INT);

    $stmt->execute();

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
