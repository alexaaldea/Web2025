<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/db.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$emailToDelete = $input['email'] ?? '';

if (!$emailToDelete) {
    http_response_code(400);
    echo json_encode(['error' => 'Email required']);
    exit;
}

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

$stmt = $pdo->prepare('SELECT role FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || $user['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

if ($emailToDelete === $email) {
    http_response_code(400);
    echo json_encode(['error' => 'You cannot delete yourself']);
    exit;
}

$stmt = $pdo->prepare('DELETE FROM users WHERE email = :email');
$stmt->execute(['email' => $emailToDelete]);

echo json_encode(['success' => true]);
