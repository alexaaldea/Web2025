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

$numberRows = fetchAll($pdo, "
    SELECT id, user_id, min_value, max_value, count, parity, sign, sorted, data_type, 
           unique_numbers, pattern, step, include_zero, include_min, include_max, 
           edge_empty_input, edge_single_element, edge_all_equal, created_at
    FROM number_generator_inputs
    WHERE user_id = :user_id
", ['user_id' => $user_id]);
foreach ($numberRows as $row) {
    $data['number'][] = [
    'id' => $row['id'],
    'created_at' => $row['created_at'],
    'input' => json_encode([
        'min' => (int)$row['min_value'],
        'max' => (int)$row['max_value'],
        'count' => (int)$row['count'],
        'parity' => $row['parity'],
        'sign' => $row['sign'],
        'sorted' => $row['sorted'],
        'unique' => (bool)$row['unique_numbers'],
        'type' => $row['data_type'],
        'pattern' => $row['pattern'],
        'includeZero' => (bool)$row['include_zero'],
        'includeMin' => (bool)$row['include_min'],
        'includeMax' => (bool)$row['include_max'],
        'edgeEmpty' => (bool)$row['edge_empty_input'],
        'edgeSingle' => (bool)$row['edge_single_element'],
        'edgeAllEqual' => (bool)$row['edge_all_equal'],
        'step' => isset($row['step']) ? (int)$row['step'] : null
    ])
];

}

$stringRows = fetchAll($pdo, "
    SELECT id, user_id, string_min, string_max, same_length, include_prefix, 
           include_suffix, sorting, string_unique, string_letter, string_count, created_at
    FROM string_generator_inputs
    WHERE user_id = :user_id
", ['user_id' => $user_id]);
foreach ($stringRows as $row) {
    $data['string'][] = [
    'id' => $row['id'],
    'created_at' => $row['created_at'],
    'input' => json_encode([
        'minLength' => (int)$row['string_min'],
        'maxLength' => (int)$row['string_max'],
        'count' => (int)$row['string_count'],
        'prefix' => $row['include_prefix'],
        'suffix' => $row['include_suffix'],
        'unique' => (bool)$row['string_unique'],
        'letters' => $row['string_letter'],
        'sameLength' => (bool)$row['same_length'],
        'sorting' => $row['sorting']
    ])
];

}


$vectorRows = fetchAll($pdo, "SELECT id, created_at, vector_length, vector_min, vector_max, vector_parity, vector_sign, vector_type, vector_unique, vector_palindrome, vector_line, vector_sorted FROM vector_generator_inputs WHERE user_id = :user_id", ['user_id' => $user_id]);

foreach ($vectorRows as $row) {
    $data['vector'][] = [
        'id' => $row['id'],
        'created_at' => $row['created_at'],
        'input' => json_encode([
            'elem' => (int)$row['vector_length'],
            'min' => (float)$row['vector_min'],
            'max' => (float)$row['vector_max'],
            'parity' => $row['vector_parity'],
            'sign' => $row['vector_sign'],
            'sorted' => $row['vector_sorted'],
            'unique' => (bool)$row['vector_unique'],
            'type' => $row['vector_type'],
            'palindrome' => (bool)$row['vector_palindrome'],
            'line' => (int)$row['vector_line']
        ])
    ];
}

$matrixRows = fetchAll($pdo, "SELECT id, created_at, matrix_rows, matrix_cols, matrix_min, matrix_max, matrix_parity, matrix_sign, matrix_unique, matrix_map FROM matrix_generator_inputs WHERE user_id = :user_id", ['user_id' => $user_id]);
foreach ($matrixRows as $row) {
    $data['matrix'][] = [
        'id' => $row['id'],
        'created_at' => $row['created_at'],
        'input' => json_encode([
            'row' => (int)$row['matrix_rows'],
            'col' => (int)$row['matrix_cols'],
            'min' => (float)$row['matrix_min'],
            'max' => (float)$row['matrix_max'],
            'parity' => $row['matrix_parity'],
            'sign' => $row['matrix_sign'],
            'unique' => (bool)$row['matrix_unique'],
            'map' => $row['matrix_map']
        ])
    ];
}


$graphRows = fetchAll($pdo, "SELECT id, created_at, graph_nodes, graph_edges, graph_oriented, graph_connected, graph_bipartit, graph_weighted, graph_min_weight, graph_max_weight FROM graph_generator_inputs WHERE user_id = :user_id", ['user_id' => $user_id]);
foreach ($graphRows as $row) {
    $data['graph'][] = [
        'id' => $row['id'],
        'created_at' => $row['created_at'],
        'input' => json_encode([
            'nodes'      => (int)$row['graph_nodes'],
            'edges'      => (int)$row['graph_edges'],
            'oriented'   => (bool)$row['graph_oriented'],
            'connected'  => (bool)$row['graph_connected'],
            'bipartit'   => (bool)$row['graph_bipartit'],
            'weighted'   => (bool)$row['graph_weighted'],
            'min_weight' => isset($row['graph_min_weight']) ? (int)$row['graph_min_weight'] : null,
            'max_weight' => isset($row['graph_max_weight']) ? (int)$row['graph_max_weight'] : null
        ])
    ];
}
$treeRows = fetchAll($pdo, "SELECT id, created_at, tree_nodes, tree_binary, tree_lvl, tree_weighted, tree_min_weight, tree_max_weight FROM tree_generator_inputs WHERE user_id = :user_id", ['user_id' => $user_id]);
foreach ($treeRows as $row) {
    $data['tree'][] = [
        'id' => $row['id'],
        'created_at' => $row['created_at'],
        'input' => json_encode([
            'nodes'      => (int)$row['tree_nodes'],
            'binary'     => (bool)$row['tree_binary'],
            'level'      => (int)$row['tree_lvl'],
            'weighted'   => (bool)$row['tree_weighted'],
            'min_weight' => isset($row['tree_min_weight']) ? (int)$row['tree_min_weight'] : null,
            'max_weight' => isset($row['tree_max_weight']) ? (int)$row['tree_max_weight'] : null
        ])
    ];
}
header('Content-Type: application/json');
echo json_encode($data);
exit;