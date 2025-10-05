// ===== DOCUMENT READY =====
$(document).ready(function() {
    carregarCurriculos();
});

// ===== CARREGAR CURRÍCULOS =====
function carregarCurriculos() {
    $.ajax({
        url: 'api/listar_curriculos.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.sucesso && response.curriculos) {
                if (response.curriculos.length > 0) {
                    renderizarCurriculos(response.curriculos);
                } else {
                    mostrarMensagemVazio();
                }
            } else {
                mostrarErro('Erro ao carregar currículos.');
            }
        },
        error: function(xhr, status, error) {
            console.error('Erro:', error);
            mostrarErro('Erro ao conectar com o servidor.');
        }
    });
}

// ===== RENDERIZAR CURRÍCULOS =====
function renderizarCurriculos(curriculos) {
    let html = '<div class="row g-4">';
    
    curriculos.forEach(function(curriculo) {
        const dataCriacao = formatarData(curriculo.created_at);
        
        html += `
            <div class="col-md-6">
                <div class="card curriculum-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title mb-0">
                                <i class="fas fa-user me-2"></i>${curriculo.nome_completo}
                            </h5>
                            <span class="badge bg-primary">ID: ${curriculo.id}</span>
                        </div>
                        
                        <div class="curriculum-info mb-3">
                            <p class="mb-1">
                                <i class="fas fa-envelope text-muted me-2"></i>
                                <small>${curriculo.email}</small>
                            </p>
                            <p class="mb-1">
                                <i class="fas fa-phone text-muted me-2"></i>
                                <small>${curriculo.telefone}</small>
                            </p>
                            ${curriculo.cidade && curriculo.estado ? `
                            <p class="mb-1">
                                <i class="fas fa-map-marker-alt text-muted me-2"></i>
                                <small>${curriculo.cidade}, ${curriculo.estado}</small>
                            </p>
                            ` : ''}
                            <p class="mb-0">
                                <i class="fas fa-calendar text-muted me-2"></i>
                                <small>Criado em: ${dataCriacao}</small>
                            </p>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary btn-sm" onclick="visualizarCurriculo(${curriculo.id})">
                                <i class="fas fa-eye me-1"></i>Visualizar
                            </button>
                            <button class="btn btn-success btn-sm" onclick="gerarPDF(${curriculo.id})">
                                <i class="fas fa-file-pdf me-1"></i>Baixar PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    $('#curriculosContainer').html(html);
}

// ===== MOSTRAR MENSAGEM VAZIO =====
function mostrarMensagemVazio() {
    const html = `
        <div class="card">
            <div class="card-body text-center py-5">
                <i class="fas fa-inbox fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">Nenhum currículo encontrado</h5>
                <p class="text-muted mb-4">Você ainda não criou nenhum currículo.</p>
                <a href="criar-curriculo.html" class="btn btn-primary">
                    <i class="fas fa-plus me-2"></i>Criar Meu Primeiro Currículo
                </a>
            </div>
        </div>
    `;
    $('#curriculosContainer').html(html);
}

// ===== MOSTRAR ERRO =====
function mostrarErro(mensagem) {
    const html = `
        <div class="card">
            <div class="card-body text-center py-5">
                <i class="fas fa-exclamation-triangle fa-4x text-danger mb-3"></i>
                <h5 class="text-danger">Erro ao carregar</h5>
                <p class="text-muted mb-4">${mensagem}</p>
                <button class="btn btn-primary" onclick="carregarCurriculos()">
                    <i class="fas fa-redo me-2"></i>Tentar Novamente
                </button>
            </div>
        </div>
    `;
    $('#curriculosContainer').html(html);
}

// ===== VISUALIZAR CURRÍCULO =====
function visualizarCurriculo(id) {
    // Mostrar loading
    mostrarLoading();
    
    $.ajax({
        url: `api/buscar_curriculo.php?id=${id}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            ocultarLoading();
            
            if (response.sucesso) {
                mostrarModalCurriculo(response.dados);
            } else {
                mostrarAlerta('Erro ao carregar currículo.', 'danger');
            }
        },
        error: function(xhr, status, error) {
            ocultarLoading();
            mostrarAlerta('Erro ao conectar com o servidor.', 'danger');
        }
    });
}

// ===== MOSTRAR MODAL CURRÍCULO =====
function mostrarModalCurriculo(dados) {
    const modalHtml = `
        <div class="modal fade" id="curriculoModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-file-alt me-2"></i>${dados.curriculo.nome_completo}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${renderizarDetalhesCurriculo(dados)}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-1"></i>Fechar
                        </button>
                        <button type="button" class="btn btn-success" onclick="gerarPDF(${dados.curriculo.id})">
                            <i class="fas fa-file-pdf me-1"></i>Baixar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior se existir
    $('#curriculoModal').remove();
    
    // Adicionar e mostrar novo modal
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('curriculoModal'));
    modal.show();
}

// ===== RENDERIZAR DETALHES DO CURRÍCULO =====
function renderizarDetalhesCurriculo(dados) {
    const c = dados.curriculo;
    let html = `
        <div class="curriculum-preview">
            <!-- Dados Pessoais -->
            <div class="section-preview mb-4">
                <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="fas fa-user me-2"></i>Dados Pessoais
                </h6>
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <strong>E-mail:</strong> ${c.email}
                    </div>
                    <div class="col-md-6 mb-2">
                        <strong>Telefone:</strong> ${c.telefone}
                    </div>
                    ${c.endereco ? `<div class="col-md-12 mb-2"><strong>Endereço:</strong> ${c.endereco}</div>` : ''}
                    ${c.cidade && c.estado ? `
                    <div class="col-md-6 mb-2">
                        <strong>Cidade/Estado:</strong> ${c.cidade}, ${c.estado}
                    </div>
                    ` : ''}
                    ${c.cep ? `<div class="col-md-6 mb-2"><strong>CEP:</strong> ${c.cep}</div>` : ''}
                    ${c.data_nascimento ? `
                    <div class="col-md-6 mb-2">
                        <strong>Data de Nascimento:</strong> ${formatarData(c.data_nascimento)}
                    </div>
                    ` : ''}
                    ${c.estado_civil ? `<div class="col-md-6 mb-2"><strong>Estado Civil:</strong> ${c.estado_civil}</div>` : ''}
                </div>
            </div>
    `;
    
    // Objetivo
    if (c.objetivo) {
        html += `
            <div class="section-preview mb-4">
                <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="fas fa-bullseye me-2"></i>Objetivo Profissional
                </h6>
                <p>${c.objetivo.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }
    
    // Resumo Profissional
    if (c.resumo_profissional) {
        html += `
            <div class="section-preview mb-4">
                <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="fas fa-user-tie me-2"></i>Resumo Profissional
                </h6>
                <p>${c.resumo_profissional.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }
    
    // Experiências
    if (dados.experiencias && dados.experiencias.length > 0) {
        html += `
            <div class="section-preview mb-4">
                <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="fas fa-briefcase me-2"></i>Experiências Profissionais
                </h6>
        `;
        
        dados.experiencias.forEach(exp => {
            const dataFim = exp.atual ? 'Atual' : formatarData(exp.data_fim);
            html += `
                <div class="experience-item mb-3 p-3 bg-light rounded">
                    <h6 class="mb-1">${exp.cargo}</h6>
                    <p class="mb-1 text-muted">${exp.empresa}</p>
                    <p class="mb-2 small text-muted">
                        <i class="fas fa-calendar me-1"></i>
                        ${formatarData(exp.data_inicio)} - ${dataFim}
                    </p>
                    ${exp.descricao ? `<p class="mb-0 small">${exp.descricao.replace(/\n/g, '<br>')}</p>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Formações
    if (dados.formacoes && dados.formacoes.length > 0) {
        html += `
            <div class="section-preview mb-4">
                <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="fas fa-graduation-cap me-2"></i>Formação Acadêmica
                </h6>
        `;
        
        dados.formacoes.forEach(form => {
            html += `
                <div class="education-item mb-3 p-3 bg-light rounded">
                    <h6 class="mb-1">${form.curso}</h6>
                    <p class="mb-1 text-muted">${form.instituicao}</p>
                    <p class="mb-0 small text-muted">
                        <i class="fas fa-calendar me-1"></i>
                        ${form.data_inicio ? formatarData(form.data_inicio) : ''} - 
                        ${form.data_fim ? formatarData(form.data_fim) : 'Em andamento'} | 
                        ${form.nivel} - ${form.status}
                    </p>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    // Habilidades
    if (dados.habilidades && dados.habilidades.length > 0) {
        html += `
            <div class="section-preview mb-4">
                <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="fas fa-star me-2"></i>Habilidades
                </h6>
                <div class="skills-container">
        `;
        
        dados.habilidades.forEach(hab => {
            html += `
                <span class="badge bg-secondary me-2 mb-2">
                    ${hab.nome} - ${hab.nivel}
                </span>
            `;
        });
        
        html += '</div></div>';
    }
    
    html += '</div>';
    return html;
}

// ===== GERAR PDF =====
function gerarPDF(id) {
    // Abrir em nova aba
    window.open(`api/gerar_pdf.php?id=${id}`, '_blank');
}

// ===== FORMATAR DATA =====
function formatarData(data) {
    if (!data) return '';
    
    const date = new Date(data + 'T00:00:00');
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
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
    
    // Auto-fechar após 5 segundos
    setTimeout(function() {
        $('.alert').fadeOut(300, function() {
            $(this).remove();
        });
    }, 5000);
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