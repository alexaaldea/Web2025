<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/db.php';

$email = $_POST['email'] ?? '';
$password = $_POST['pwd'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password required.']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, password FROM users WHERE email = :email');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid email or password.']);
    exit;
}

$key = "Aceasta este o cheie ultra secreta";
$iss_time = time();
$payload = [
    "iss" => "https://www.inpot.local",
    "iat" => $iss_time,
    "exp" => $iss_time + 60 * 60 * 24 * 15, 
    "email" => $email,
];

$jwt = JWT::encode($payload, $key, 'HS256');

setcookie('jwt', $jwt, time() + 60 * 60 * 24 * 15, "/");

echo json_encode(['token' => $jwt]);
exit;
?>