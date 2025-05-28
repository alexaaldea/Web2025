<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$key = "Aceasta este o cheie ultra secreta";


$jwt = $_COOKIE['jwt'] ?? '';
if (!$jwt) {
    http_response_code(400);
    echo json_encode(['message' => 'No token']);
    exit;
}

try {
    $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    echo json_encode(['message' => 'valid']);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['message' => 'invalid token', 'error' => $e->getMessage()]);
}
?>