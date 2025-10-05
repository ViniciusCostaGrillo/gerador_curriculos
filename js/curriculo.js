// ===== VARIÁVEIS GLOBAIS =====
let experienciaCount = 0;
let formacaoCount = 0;
let habilidadeCount = 0;

// ===== DOCUMENT READY =====
$(document).ready(function() {
    // Aplicar máscaras
    aplicarMascaras();
    
    // Calcular idade automaticamente
    $('#data_nascimento').on('change', calcularIdade);
    
    // Eventos de adicionar itens dinâmicos
    $('#addExperiencia').on('click', adicionarExperiencia);
    $('#addFormacao').on('click', adicionarFormacao);
    $('#addHabilidade').on('click', adicionarHabilidade);
    
    // Submit do formulário
    $('#curriculoForm').on('submit', enviarCurriculo);
    
    // Adicionar primeira experiência automaticamente
    adicionarExperiencia();
    adicionarFormacao();
    adicionarHabilidade();
});

// ===== MÁSCARAS =====
function aplicarMascaras() {
    $('#telefone').mask('(00) 00000-0000');
    $('#cep').mask('00000-000');
}

// ===== CALCULAR IDADE =====
function calcularIdade() {
    const dataNascimento = new Date($('#data_nascimento').val());
    const hoje = new Date();
    
    if (dataNascimento > hoje) {
        mostrarAlerta('Data de nascimento não pode ser futura!', 'warning');
        $('#data_nascimento').val('');
        $('#idade').val('');
        return;
    }
    
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = dataNascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    
    $('#idade').val(idade + ' anos');
}

// ===== ADICIONAR EXPERIÊNCIA =====
function adicionarExperiencia() {
    experienciaCount++;
    
    const html = `
        <div class="dynamic-item fade-in" id="experiencia-${experienciaCount}">
            <div class="item-header">
                <span><i class="fas fa-briefcase me-2"></i>Experiência ${experienciaCount}</span>
                <button type="button" class="btn btn-sm btn-danger" onclick="removerItem('experiencia-${experienciaCount}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label required">Empresa</label>
                    <input type="text" class="form-control" name="experiencias[${experienciaCount}][empresa]" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label required">Cargo</label>
                    <input type="text" class="form-control" name="experiencias[${experienciaCount}][cargo]" required>
                </div>
                <div class="col-md-5">
                    <label class="form-label required">Data Início</label>
                    <input type="date" class="form-control" name="experiencias[${experienciaCount}][data_inicio]" required>
                </div>
                <div class="col-md-5">
                    <label class="form-label">Data Fim</label>
                    <input type="date" class="form-control" name="experiencias[${experienciaCount}][data_fim]" id="exp-data-fim-${experienciaCount}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">&nbsp;</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="experiencias[${experienciaCount}][atual]" 
                               id="exp-atual-${experienciaCount}" onchange="toggleDataFim(${experienciaCount}, 'exp')">
                        <label class="form-check-label" for="exp-atual-${experienciaCount}">
                            Atual
                        </label>
                    </div>
                </div>
                <div class="col-md-12">
                    <label class="form-label">Descrição das Atividades</label>
                    <textarea class="form-control" name="experiencias[${experienciaCount}][descricao]" rows="3" 
                              placeholder="Descreva suas principais responsabilidades e conquistas..."></textarea>
                </div>
            </div>
        </div>
    `;
    
    $('#experienciasContainer').append(html);
}

// ===== ADICIONAR FORMAÇÃO =====
function adicionarFormacao() {
    formacaoCount++;
    
    const html = `
        <div class="dynamic-item fade-in" id="formacao-${formacaoCount}">
            <div class="item-header">
                <span><i class="fas fa-graduation-cap me-2"></i>Formação ${formacaoCount}</span>
                <button type="button" class="btn btn-sm btn-danger" onclick="removerItem('formacao-${formacaoCount}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label required">Instituição</label>
                    <input type="text" class="form-control" name="formacoes[${formacaoCount}][instituicao]" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label required">Curso</label>
                    <input type="text" class="form-control" name="formacoes[${formacaoCount}][curso]" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Nível</label>
                    <select class="form-select" name="formacoes[${formacaoCount}][nivel]">
                        <option value="Ensino Fundamental">Ensino Fundamental</option>
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Tecnólogo">Tecnólogo</option>
                        <option value="Graduação" selected>Graduação</option>
                        <option value="Pós-graduação">Pós-graduação</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Doutorado">Doutorado</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select class="form-select" name="formacoes[${formacaoCount}][status]">
                        <option value="Em andamento">Em andamento</option>
                        <option value="Concluído" selected>Concluído</option>
                        <option value="Trancado">Trancado</option>
                        <option value="Incompleto">Incompleto</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Data Início</label>
                    <input type="date" class="form-control" name="formacoes[${formacaoCount}][data_inicio]">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Data Conclusão</label>
                    <input type="date" class="form-control" name="formacoes[${formacaoCount}][data_fim]">
                </div>
            </div>
        </div>
    `;
    
    $('#formacoesContainer').append(html);
}

// ===== ADICIONAR HABILIDADE =====
function adicionarHabilidade() {
    habilidadeCount++;
    
    const html = `
        <div class="dynamic-item fade-in" id="habilidade-${habilidadeCount}">
            <div class="item-header">
                <span><i class="fas fa-star me-2"></i>Habilidade ${habilidadeCount}</span>
                <button type="button" class="btn btn-sm btn-danger" onclick="removerItem('habilidade-${habilidadeCount}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="row g-3">
                <div class="col-md-5">
                    <label class="form-label required">Nome da Habilidade</label>
                    <input type="text" class="form-control" name="habilidades[${habilidadeCount}][nome]" 
                           placeholder="Ex: JavaScript, Liderança, etc." required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Nível</label>
                    <select class="form-select" name="habilidades[${habilidadeCount}][nivel]">
                        <option value="Básico">Básico</option>
                        <option value="Intermediário" selected>Intermediário</option>
                        <option value="Avançado">Avançado</option>
                        <option value="Especialista">Especialista</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Tipo</label>
                    <select class="form-select" name="habilidades[${habilidadeCount}][tipo]">
                        <option value="Técnica" selected>Técnica</option>
                        <option value="Comportamental">Comportamental</option>
                        <option value="Idioma">Idioma</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    $('#habilidadesContainer').append(html);
}

// ===== REMOVER ITEM =====
function removerItem(id) {
    if (confirm('Deseja realmente remover este item?')) {
        $(`#${id}`).fadeOut(300, function() {
            $(this).remove();
        });
    }
}

// ===== TOGGLE DATA FIM =====
function toggleDataFim(id, tipo) {
    const checkbox = $(`#${tipo}-atual-${id}`);
    const dataFim = $(`#${tipo}-data-fim-${id}`);
    
    if (checkbox.is(':checked')) {
        dataFim.val('').prop('disabled', true).prop('required', false);
    } else {
        dataFim.prop('disabled', false);
    }
}

// ===== ENVIAR CURRÍCULO =====
function enviarCurriculo(e) {
    e.preventDefault();
    
    // Validar formulário
    if (!validarFormulario()) {
        return false;
    }
    
    // Mostrar loading
    mostrarLoading();
    
    // Coletar dados do formulário
    const dados = coletarDados();
    
    // Enviar via AJAX
    $.ajax({
        url: 'api/processar_curriculo.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(dados),
        success: function(response) {
            ocultarLoading();
            
            if (response.sucesso) {
                mostrarAlerta('Currículo criado com sucesso!', 'success');
                
                // Perguntar se deseja gerar PDF
                if (confirm('Currículo salvo! Deseja gerar o PDF agora?')) {
                    gerarPDF(response.curriculo_id);
                } else {
                    // Redirecionar após 2 segundos
                    setTimeout(function() {
                        window.location.href = 'listar-curriculos.html';
                    }, 2000);
                }
            } else {
                mostrarAlerta('Erro ao criar currículo: ' + response.mensagem, 'danger');
            }
        },
        error: function(xhr, status, error) {
            ocultarLoading();
            let mensagem = 'Erro ao processar requisição.';
            
            if (xhr.responseJSON && xhr.responseJSON.erro) {
                mensagem = xhr.responseJSON.erro;
                
                if (xhr.responseJSON.detalhes) {
                    if (Array.isArray(xhr.responseJSON.detalhes)) {
                        mensagem += '<br>' + xhr.responseJSON.detalhes.join('<br>');
                    } else {
                        mensagem += '<br>' + xhr.responseJSON.detalhes;
                    }
                }
            }
            
            mostrarAlerta(mensagem, 'danger');
        }
    });
}

// ===== VALIDAR FORMULÁRIO =====
function validarFormulario() {
    // Validações básicas do HTML5
    const form = document.getElementById('curriculoForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    
    // Validar email
    const email = $('#email').val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        mostrarAlerta('Por favor, insira um e-mail válido.', 'warning');
        $('#email').focus();
        return false;
    }
    
    // Validar se há pelo menos uma experiência
    if ($('#experienciasContainer .dynamic-item').length === 0) {
        mostrarAlerta('Adicione pelo menos uma experiência profissional.', 'warning');
        return false;
    }
    
    return true;
}

// ===== COLETAR DADOS =====
function coletarDados() {
    const dados = {
        // Dados pessoais
        nome_completo: $('#nome_completo').val(),
        email: $('#email').val(),
        telefone: $('#telefone').val(),
        endereco: $('#endereco').val(),
        cidade: $('#cidade').val(),
        estado: $('#estado').val(),
        cep: $('#cep').val(),
        data_nascimento: $('#data_nascimento').val() || null,
        estado_civil: $('#estado_civil').val(),
        objetivo: $('#objetivo').val(),
        resumo_profissional: $('#resumo_profissional').val(),
        
        // Arrays
        experiencias: [],
        formacoes: [],
        habilidades: []
    };
    
    // Coletar experiências
    $('#experienciasContainer .dynamic-item').each(function() {
        const exp = {
            empresa: $(this).find('input[name$="[empresa]"]').val(),
            cargo: $(this).find('input[name$="[cargo]"]').val(),
            data_inicio: $(this).find('input[name$="[data_inicio]"]').val(),
            data_fim: $(this).find('input[name$="[data_fim]"]').val() || null,
            descricao: $(this).find('textarea[name$="[descricao]"]').val(),
            atual: $(this).find('input[name$="[atual]"]').is(':checked') ? 1 : 0
        };
        dados.experiencias.push(exp);
    });
    
    // Coletar formações
    $('#formacoesContainer .dynamic-item').each(function() {
        const form = {
            instituicao: $(this).find('input[name$="[instituicao]"]').val(),
            curso: $(this).find('input[name$="[curso]"]').val(),
            nivel: $(this).find('select[name$="[nivel]"]').val(),
            status: $(this).find('select[name$="[status]"]').val(),
            data_inicio: $(this).find('input[name$="[data_inicio]"]').val() || null,
            data_fim: $(this).find('input[name$="[data_fim]"]').val() || null
        };
        dados.formacoes.push(form);
    });
    
    // Coletar habilidades
    $('#habilidadesContainer .dynamic-item').each(function() {
        const hab = {
            nome: $(this).find('input[name$="[nome]"]').val(),
            nivel: $(this).find('select[name$="[nivel]"]').val(),
            tipo: $(this).find('select[name$="[tipo]"]').val()
        };
        dados.habilidades.push(hab);
    });
    
    return dados;
}

// ===== GERAR PDF =====
function gerarPDF(curriculoId) {
    window.open('api/gerar_pdf.php?id=' + curriculoId, '_blank');
}

// ===== MOSTRAR ALERTA =====
function mostrarAlerta(mensagem, tipo) {
    const alertHtml = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    $('#alertContainer').html(alertHtml);
    
    // Scroll para o topo
    $('html, body').animate({ scrollTop: 0 }, 300);
    
    // Auto-fechar após 5 segundos (exceto erros)
    if (tipo !== 'danger') {
        setTimeout(function() {
            $('.alert').fadeOut(300, function() {
                $(this).remove();
            });
        }, 5000);
    }
}

// ===== LOADING =====
function mostrarLoading() {
    const loadingHtml = `
        <div class="spinner-overlay">
            <div class="spinner-border text-light spinner-border-custom" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>
    `;
    $('body').append(loadingHtml);
}

function ocultarLoading() {
    $('.spinner-overlay').fadeOut(300, function() {
        $(this).remove();
    });
}