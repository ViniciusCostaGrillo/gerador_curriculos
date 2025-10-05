<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING); // ignora notices e warnings
ini_set('display_errors', 0); // não exibe erros na tela, só no log
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/erros.log');

session_start();
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit;
}

require_once '../config/database.php';
require_once '../models/Curriculo.php';
require_once '../models/Experiencia.php';
require_once '../models/Formacao.php';
require_once '../models/Habilidade.php';

$database = new Database();
$db = $database->getConnection();

// Receber dados JSON
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados inválidos']);
    exit;
}

// Validação básica
$erros = [];

if (empty($data->nome_completo)) {
    $erros[] = 'Nome completo é obrigatório';
}

if (empty($data->email) || !filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    $erros[] = 'Email válido é obrigatório';
}

if (empty($data->telefone)) {
    $erros[] = 'Telefone é obrigatório';
}

if (!empty($erros)) {
    http_response_code(400);
    echo json_encode(['erro' => 'Validação falhou', 'detalhes' => $erros]);
    exit;
}

// Iniciar transação
$db->beginTransaction();

try {
    // Criar currículo principal
    $curriculo = new Curriculo($db);
    $curriculo->nome_completo = $data->nome_completo;
    $curriculo->email = $data->email;
    $curriculo->telefone = $data->telefone;
    $curriculo->endereco = $data->endereco ?? '';
    $curriculo->cidade = $data->cidade ?? '';
    $curriculo->estado = $data->estado ?? '';
    $curriculo->cep = $data->cep ?? '';
    $curriculo->data_nascimento = $data->data_nascimento ?? null;
    $curriculo->estado_civil = $data->estado_civil ?? '';
    $curriculo->objetivo = $data->objetivo ?? '';
    $curriculo->resumo_profissional = $data->resumo_profissional ?? '';

    $curriculo_id = $curriculo->criar();

    if (!$curriculo_id) {
        throw new Exception('Erro ao criar currículo');
    }

    // Adicionar experiências
    if (!empty($data->experiencias)) {
        foreach ($data->experiencias as $exp) {
            $experiencia = new Experiencia($db);
            $experiencia->curriculo_id = $curriculo_id;
            $experiencia->empresa = $exp->empresa;
            $experiencia->cargo = $exp->cargo;
            $experiencia->data_inicio = $exp->data_inicio;
            $experiencia->data_fim = $exp->data_fim ?? null;
            $experiencia->descricao = $exp->descricao ?? '';
            $experiencia->atual = $exp->atual ?? 0;

            if (!$experiencia->criar()) {
                throw new Exception('Erro ao adicionar experiência');
            }
        }
    }

    // Adicionar formações
    if (!empty($data->formacoes)) {
        foreach ($data->formacoes as $form) {
            $formacao = new Formacao($db);
            $formacao->curriculo_id = $curriculo_id;
            $formacao->instituicao = $form->instituicao;
            $formacao->curso = $form->curso;
            $formacao->nivel = $form->nivel;
            $formacao->data_inicio = $form->data_inicio;
            $formacao->data_fim = $form->data_fim ?? null;
            $formacao->status = $form->status ?? 'Concluído';

            if (!$formacao->criar()) {
                throw new Exception('Erro ao adicionar formação');
            }
        }
    }

    // Adicionar habilidades
    if (!empty($data->habilidades)) {
        foreach ($data->habilidades as $hab) {
            $habilidade = new Habilidade($db);
            $habilidade->curriculo_id = $curriculo_id;
            $habilidade->nome = $hab->nome;
            $habilidade->nivel = $hab->nivel ?? 'Intermediário';
            $habilidade->tipo = $hab->tipo ?? 'Técnica';

            if (!$habilidade->criar()) {
                throw new Exception('Erro ao adicionar habilidade');
            }
        }
    }

    // Confirmar transação
    $db->commit();

    // Armazenar ID na sessão para geração de PDF
    $_SESSION['curriculo_id'] = $curriculo_id;

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Currículo criado com sucesso',
        'curriculo_id' => $curriculo_id
    ]);

} catch (Exception $e) {
    // Reverter transação em caso de erro
    $db->rollBack();
    
    http_response_code(500);
    echo json_encode([
        'erro' => 'Erro ao processar currículo',
        'detalhes' => $e->getMessage()
    ]);
}
?>