<?php
$host = 'localhost'; 
$db   = 'postgres'; 
$user = 'postgres'; 
$pass = 'STUDENT'; 
$port = '5432'; 

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database connected!<br>";
    

    $stmt = $pdo->query('SELECT id, first_name FROM users');
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($results) {
        foreach ($results as $row) {
            echo "ID: " . htmlspecialchars($row['id']) . " | Name: " . htmlspecialchars($row['first_name']) . "<br>";
        }
    } else {
        echo "No users found.";
    }
    
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
