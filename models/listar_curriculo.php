<?php
session_start();
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';
require_once '../models/Curriculo.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Erro ao conectar com o banco de dados');
    }
    
    $curriculo = new Curriculo($db);
    $curriculos = $curriculo->listarTodos();
    
    echo json_encode([
        'sucesso' => true,
        'curriculos' => $curriculos
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'erro' => 'Erro ao listar currículos',
        'detalhes' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>