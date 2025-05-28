<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

setcookie('jwt', '', time() - 3600, '/');

header("Location: ../views/login.html");
exit;
?>