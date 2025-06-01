<?php
$host = 'localhost'; 
$db   = 'postgres'; 
$user = 'postgres'; 
$pass = 'STUDENT'; 
$port = '5432'; 

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Use exception here, no echo
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
?>
