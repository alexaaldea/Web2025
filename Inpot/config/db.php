<?php
$host = 'localhost'; 
$db   = 'postgres'; 
$user = 'postgres'; 
$pass = 'STUDENT'; 
$port = '5432'; 

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connected!!! war is over";
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

?>
