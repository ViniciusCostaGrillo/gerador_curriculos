<?php
// Conexão
require_once __DIR__ . '/../config/database.php';

// Models
require_once __DIR__ . '/../models/Curriculo.php';
require_once __DIR__ . '/../models/Experiencia.php';
require_once __DIR__ . '/../models/Formacao.php';
require_once __DIR__ . '/../models/Habilidade.php';

// Biblioteca FPDF
require_once __DIR__ . '/../libs/fpdf.php';

/**
 * Função para converter UTF-8 para ISO-8859-1 (Latin1)
 * FPDF trabalha com ISO-8859-1, não UTF-8
 */
function utf8ToLatin1($text) {
    if (empty($text)) {
        return '';
    }
    
    // Forçar conversão de UTF-8 para ISO-8859-1
    return iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
}

/**
 * Classe extendida do FPDF para adicionar funcionalidades
 */
class PDF extends FPDF {
    private $curriculo;
    
    public function setCurriculo($curriculo) {
        $this->curriculo = $curriculo;
    }
    
    // Cabeçalho
    function Header() {
        // Logo ou título (opcional)
        $this->SetFont('Arial', 'B', 16);
        $this->SetTextColor(13, 110, 253); // Azul
        $this->Cell(0, 10, utf8ToLatin1('Currículo Profissional'), 0, 1, 'C');
        $this->Ln(5);
    }
    
    // Rodapé
    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(128, 128, 128);
        $this->Cell(0, 10, utf8ToLatin1('Página ') . $this->PageNo(), 0, 0, 'C');
    }
    
    // Método para adicionar seção
    function AddSection($title) {
        $this->Ln(5);
        $this->SetFont('Arial', 'B', 14);
        $this->SetTextColor(13, 110, 253);
        $this->Cell(0, 8, utf8ToLatin1($title), 0, 1);
        $this->SetDrawColor(13, 110, 253);
        $this->SetLineWidth(0.5);
        $this->Line($this->GetX(), $this->GetY(), $this->GetX() + 190, $this->GetY());
        $this->Ln(3);
        $this->SetTextColor(0, 0, 0);
    }
    
    // Método para texto justificado
    function MultiCellJustify($w, $h, $txt) {
        $this->MultiCell($w, $h, utf8ToLatin1($txt), 0, 'J');
    }
}

try {
    // Criar conexão
    $database = new Database();
    $db = $database->getConnection();

    // Pega o ID do currículo pela URL
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id <= 0) {
        die("ID invalido.");
    }

    // Instanciar classes
    $curriculoModel   = new Curriculo($db);
    $experienciaModel = new Experiencia($db);
    $formacaoModel    = new Formacao($db);
    $habilidadeModel  = new Habilidade($db);

    // Buscar dados
    $curriculo    = $curriculoModel->buscarPorId($id);
    $experiencias = $experienciaModel->buscarPorCurriculo($id);
    $formacoes    = $formacaoModel->buscarPorCurriculo($id);
    $habilidades  = $habilidadeModel->buscarPorCurriculo($id);

    if (!$curriculo) {
        die("Curriculo nao encontrado.");
    }

    // Criar PDF
    $pdf = new PDF();
    $pdf->setCurriculo($curriculo);
    $pdf->AddPage();
    $pdf->SetFont('Arial', '', 11);
    $pdf->SetAutoPageBreak(true, 20);

    // ====================
    // DADOS PESSOAIS
    // ====================
    $pdf->SetFont('Arial', 'B', 18);
    $pdf->SetTextColor(13, 110, 253);
    $pdf->Cell(0, 12, utf8ToLatin1($curriculo['nome_completo']), 0, 1, 'C');
    $pdf->Ln(2);

    // Informações de contato
    $pdf->SetFont('Arial', '', 10);
    $pdf->SetTextColor(80, 80, 80);
    
    $contato = '';
    $contato .= 'Email: ' . $curriculo['email'] . ' | ';
    $contato .= 'Telefone: ' . $curriculo['telefone'];
    
    $pdf->Cell(0, 6, utf8ToLatin1($contato), 0, 1, 'C');
    
    if (!empty($curriculo['cidade']) && !empty($curriculo['estado'])) {
        $localizacao = $curriculo['cidade'] . ' - ' . $curriculo['estado'];
        $pdf->Cell(0, 6, utf8ToLatin1($localizacao), 0, 1, 'C');
    }
    
    if (!empty($curriculo['endereco'])) {
        $pdf->Cell(0, 6, utf8ToLatin1($curriculo['endereco']), 0, 1, 'C');
    }
    
    if (!empty($curriculo['cep'])) {
        $pdf->Cell(0, 6, utf8ToLatin1('CEP: ' . $curriculo['cep']), 0, 1, 'C');
    }
    
    $pdf->SetTextColor(0, 0, 0);
    $pdf->Ln(3);

    // Linha separadora
    $pdf->SetDrawColor(200, 200, 200);
    $pdf->Line(10, $pdf->GetY(), 200, $pdf->GetY());
    $pdf->Ln(5);

    // ====================
    // OBJETIVO PROFISSIONAL
    // ====================
    if (!empty($curriculo['objetivo'])) {
        $pdf->AddSection('Objetivo Profissional');
        $pdf->SetFont('Arial', '', 11);
        $pdf->MultiCellJustify(0, 6, $curriculo['objetivo']);
    }

    // ====================
    // RESUMO PROFISSIONAL
    // ====================
    if (!empty($curriculo['resumo_profissional'])) {
        $pdf->AddSection('Resumo Profissional');
        $pdf->SetFont('Arial', '', 11);
        $pdf->MultiCellJustify(0, 6, $curriculo['resumo_profissional']);
    }

    // ====================
    // EXPERIÊNCIAS PROFISSIONAIS
    // ====================
    if (!empty($experiencias)) {
        $pdf->AddSection('Experiencia Profissional');
        
        foreach ($experiencias as $exp) {
            // Fundo cinza para cada experiência
            $pdf->SetFillColor(248, 249, 250);
            $y_before = $pdf->GetY();
            
            // Cargo (negrito)
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->Cell(0, 7, utf8ToLatin1($exp['cargo']), 0, 1, '', true);
            
            // Empresa (itálico)
            $pdf->SetFont('Arial', 'I', 11);
            $pdf->Cell(0, 6, utf8ToLatin1($exp['empresa']), 0, 1, '', true);
            
            // Período
            $pdf->SetFont('Arial', '', 9);
            $pdf->SetTextColor(100, 100, 100);
            $data_inicio = date('m/Y', strtotime($exp['data_inicio']));
            $data_fim = $exp['atual'] ? 'Atual' : date('m/Y', strtotime($exp['data_fim']));
            $periodo = $data_inicio . ' - ' . $data_fim;
            $pdf->Cell(0, 5, utf8ToLatin1($periodo), 0, 1, '', true);
            
            // Descrição
            if (!empty($exp['descricao'])) {
                $pdf->SetFont('Arial', '', 10);
                $pdf->SetTextColor(0, 0, 0);
                $pdf->MultiCell(0, 5, utf8ToLatin1($exp['descricao']), 0, 'L', true);
            }
            
            $pdf->SetTextColor(0, 0, 0);
            $pdf->Ln(3);
        }
    }

    // ====================
    // FORMAÇÃO ACADÊMICA
    // ====================
    if (!empty($formacoes)) {
        $pdf->AddSection('Formacao Academica');
        
        foreach ($formacoes as $form) {
            // Fundo cinza
            $pdf->SetFillColor(248, 249, 250);
            
            // Curso (negrito)
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->Cell(0, 7, utf8ToLatin1($form['curso']), 0, 1, '', true);
            
            // Instituição (itálico)
            $pdf->SetFont('Arial', 'I', 11);
            $pdf->Cell(0, 6, utf8ToLatin1($form['instituicao']), 0, 1, '', true);
            
            // Período e Status
            $pdf->SetFont('Arial', '', 9);
            $pdf->SetTextColor(100, 100, 100);
            
            $periodo = '';
            if (!empty($form['data_inicio'])) {
                $periodo .= date('m/Y', strtotime($form['data_inicio']));
            }
            if (!empty($form['data_fim'])) {
                $periodo .= ' - ' . date('m/Y', strtotime($form['data_fim']));
            } else {
                $periodo .= ' - Em andamento';
            }
            
            $pdf->Cell(0, 5, utf8ToLatin1($periodo), 0, 1, '', true);
            
            // Nível e Status
            $info = 'Nivel: ' . $form['nivel'] . ' | Status: ' . $form['status'];
            $pdf->Cell(0, 5, utf8ToLatin1($info), 0, 1, '', true);
            
            $pdf->SetTextColor(0, 0, 0);
            $pdf->Ln(3);
        }
    }

    // ====================
    // HABILIDADES
    // ====================
    if (!empty($habilidades)) {
        $pdf->AddSection('Habilidades');
        
        $pdf->SetFont('Arial', '', 10);
        
        // Agrupar por tipo
        $hab_tecnicas = [];
        $hab_comportamentais = [];
        $hab_idiomas = [];
        
        foreach ($habilidades as $hab) {
            $texto = $hab['nome'] . ' - ' . $hab['nivel'];
            
            if ($hab['tipo'] == 'Tecnica') {
                $hab_tecnicas[] = $texto;
            } elseif ($hab['tipo'] == 'Comportamental') {
                $hab_comportamentais[] = $texto;
            } elseif ($hab['tipo'] == 'Idioma') {
                $hab_idiomas[] = $texto;
            }
        }
        
        // Habilidades Técnicas
        if (!empty($hab_tecnicas)) {
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(0, 6, utf8ToLatin1('Tecnicas:'), 0, 1);
            $pdf->SetFont('Arial', '', 10);
            
            foreach ($hab_tecnicas as $hab) {
                $pdf->Cell(5, 5, utf8ToLatin1('•'), 0, 0);
                $pdf->Cell(0, 5, utf8ToLatin1($hab), 0, 1);
            }
            $pdf->Ln(2);
        }
        
        // Habilidades Comportamentais
        if (!empty($hab_comportamentais)) {
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(0, 6, utf8ToLatin1('Comportamentais:'), 0, 1);
            $pdf->SetFont('Arial', '', 10);
            
            foreach ($hab_comportamentais as $hab) {
                $pdf->Cell(5, 5, utf8ToLatin1('•'), 0, 0);
                $pdf->Cell(0, 5, utf8ToLatin1($hab), 0, 1);
            }
            $pdf->Ln(2);
        }
        
        // Idiomas
        if (!empty($hab_idiomas)) {
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(0, 6, utf8ToLatin1('Idiomas:'), 0, 1);
            $pdf->SetFont('Arial', '', 10);
            
            foreach ($hab_idiomas as $hab) {
                $pdf->Cell(5, 5, utf8ToLatin1('•'), 0, 0);
                $pdf->Cell(0, 5, utf8ToLatin1($hab), 0, 1);
            }
        }
    }

    // Nome do arquivo
    $nome_arquivo = 'Curriculo_' . preg_replace('/[^A-Za-z0-9_]/', '_', $curriculo['nome_completo']) . '.pdf';

    // Saída do PDF
    $pdf->Output('I', $nome_arquivo);

} catch (Exception $e) {
    die('Erro ao gerar PDF: ' . $e->getMessage());
}
?>