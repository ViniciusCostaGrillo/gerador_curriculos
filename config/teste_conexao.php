<?php
require_once 'config/database.php';
$database = new Database();
$conn = $database->getConnection();

if($conn){
    echo "Conexão OK!";
} else {
    echo "Erro na conexão!";
}
?>