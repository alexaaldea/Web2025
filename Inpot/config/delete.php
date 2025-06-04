<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['type'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid data']);
    exit;
}

$id = intval($data['id']);
$type = strtolower($data['type']);


$tableMap = [
    'number' => 'number_generator_inputs',
    'string' => 'string_generator_inputs',
    'vector' => 'vector_generator_inputs',
    'matrix' => 'matrix_generator_inputs',
    'graph'  => 'graph_generator_inputs',  
    'tree'   => 'tree_generator_inputs'    
];

if (!array_key_exists($type, $tableMap)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid type']);
    exit;
}

$table = $tableMap[$type];

try {

    $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
