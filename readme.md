# 📄 Gerador de Currículos - Sistema Web

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

Sistema completo para criação e gerenciamento de currículos profissionais desenvolvido como projeto acadêmico para a disciplina **Fundamentos de Programação para Internet** da UNIPAR EAD.

## 📋 Sobre o Projeto

Este sistema permite que usuários criem currículos profissionais de forma rápida e intuitiva através de uma interface web moderna e responsiva. O sistema oferece funcionalidades de inclusão dinâmica de campos, validação de dados e exportação em PDF.

## ✨ Funcionalidades

- ✅ **Cadastro de Dados Pessoais**: Nome, contato, endereço, data de nascimento com cálculo automático de idade
- ✅ **Objetivo Profissional**: Campo para definir objetivos de carreira
- ✅ **Resumo Profissional**: Destaque suas qualificações e experiência
- ✅ **Experiências Profissionais**: Adicione múltiplas experiências com campos dinâmicos
- ✅ **Formação Acadêmica**: Registre cursos e certificações
- ✅ **Habilidades**: Liste habilidades técnicas e comportamentais com níveis
- ✅ **Geração de PDF**: Exporte currículos em formato PDF profissional
- ✅ **Listagem de Currículos**: Visualize e gerencie todos os currículos criados
- ✅ **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile

## 🛠️ Tecnologias Utilizadas

### Backend
- **PHP 7.4+**: Linguagem de programação server-side
- **MySQL**: Sistema de gerenciamento de banco de dados
- **mPDF**: Biblioteca para geração de arquivos PDF
- **PDO**: Interface para acesso ao banco de dados

### Frontend
- **HTML5**: Estruturação das páginas
- **CSS3**: Estilização customizada
- **Bootstrap 5.3**: Framework CSS responsivo
- **JavaScript ES6**: Lógica client-side
- **jQuery 3.7**: Manipulação do DOM e AJAX
- **Font Awesome 6.4**: Ícones
- **jQuery Mask Plugin**: Máscaras para inputs

## 📁 Estrutura do Projeto

```
curriculo-generator/
│
├── config/
│   └── database.php              # Configuração do banco de dados
│
├── models/
│   ├── Curriculo.php             # Model de Currículo
│   ├── Experiencia.php           # Model de Experiências
│   ├── Formacao.php              # Model de Formações
│   └── Habilidade.php            # Model de Habilidades
│
├── api/
│   ├── processar_curriculo.php   # Processa criação de currículo
│   ├── listar_curriculos.php     # Lista todos os currículos
│   ├── buscar_curriculo.php      # Busca detalhes de um currículo
│   └── gerar_pdf.php             # Gera PDF do currículo
│
├── css/
│   └── style.css                 # Estilos personalizados
│
├── js/
│   ├── curriculo.js              # JavaScript do formulário
│   └── listar.js                 # JavaScript da listagem
│
├── vendor/                       # Dependências do Composer
│
├── index.html                    # Página inicial
├── criar-curriculo.html          # Formulário de criação
├── listar-curriculos.html        # Listagem de currículos
├── schema.sql                    # Script de criação do banco
├── composer.json                 # Dependências PHP
└── README.md                     # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- XAMPP (ou qualquer servidor com PHP 7.4+ e MySQL)
- Composer (gerenciador de dependências PHP)
- Navegador web moderno

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/curriculo-generator.git
cd curriculo-generator
```

### Passo 2: Instalar Dependências

```bash
composer install
```

### Passo 3: Configurar o Banco de Dados

1. Inicie o XAMPP (Apache e MySQL)
2. Acesse o phpMyAdmin (http://localhost/phpmyadmin)
3. Crie um novo banco de dados chamado `curriculo_generator`
4. Execute o script SQL disponível em `schema.sql`

Ou via linha de comando:

```bash
mysql -u root -p < schema.sql
```

### Passo 4: Configurar Conexão

Edite o arquivo `config/database.php` com suas credenciais:

```php
private $host = "localhost";
private $db_name = "curriculo_generator";
private $username = "root";
private $password = ""; // Sua senha do MySQL
```

### Passo 5: Acessar o Sistema

Coloque o projeto na pasta `htdocs` do XAMPP e acesse:

```
http://localhost/curriculo-generator/
```

## 💡 Como Usar

### Criar um Novo Currículo

1. Acesse a página inicial
2. Clique em "Criar Novo Currículo"
3. Preencha os dados pessoais (campos com * são obrigatórios)
4. Adicione experiências profissionais clicando no botão "+"
5. Adicione formações acadêmicas
6. Liste suas habilidades
7. Clique em "Salvar Currículo"
8. Escolha se deseja baixar o PDF imediatamente

### Visualizar Currículos

1. Acesse "Meus Currículos" no menu
2. Clique em "Visualizar" para ver os detalhes
3. Clique em "Baixar PDF" para exportar

## 🎯 Funcionalidades Técnicas

### Campos Dinâmicos

O sistema utiliza jQuery para adicionar e remover campos dinamicamente:

```javascript
$('#addExperiencia').on('click', adicionarExperiencia);
```

### Cálculo Automático de Idade

JavaScript calcula a idade automaticamente ao selecionar a data de nascimento:

```javascript
$('#data_nascimento').on('change', calcularIdade);
```

### Máscaras de Input

Utiliza jQuery Mask Plugin para formatar telefone e CEP:

```javascript
$('#telefone').mask('(00) 00000-0000');
$('#cep').mask('00000-000');
```

### Validação de Dados

- Validação client-side com HTML5 e JavaScript
- Validação server-side com PHP
- Sanitização de dados antes de inserir no banco

### Transações de Banco de Dados

Utiliza transações PDO para garantir integridade:

```php
$db->beginTransaction();
try {
    // Operações
    $db->commit();
} catch (Exception $e) {
    $db->rollBack();
}
```

## 🔒 Segurança

- ✅ Prepared Statements (PDO) para prevenir SQL Injection
- ✅ Sanitização de inputs com `htmlspecialchars()` e `strip_tags()`
- ✅ Validação de e-mail com `filter_var()`
- ✅ Headers de segurança configurados
- ✅ Tratamento de erros adequado

## 📱 Responsividade

O sistema é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- 📱 Mobile: < 576px
- 📱 Tablet: 576px - 768px
- 💻 Desktop: > 768px

## 🎨 Design

O design segue princípios modernos de UX/UI:

- Interface limpa e intuitiva
- Hierarquia visual clara
- Feedback visual para ações do usuário
- Animações sutis para melhor experiência
- Paleta de cores profissional

## 📦 Dependências

### PHP (via Composer)

```json
{
    "require": {
        "mpdf/mpdf": "^8.0"
    }
}
```

### JavaScript (via CDN)

- Bootstrap 5.3.0
- jQuery 3.7.0
- jQuery Mask Plugin 1.14.16
- Font Awesome 6.4.0

## 🐛 Troubleshooting

### Erro de Conexão com Banco de Dados

Verifique se:
- MySQL está rodando no XAMPP
- As credenciais em `database.php` estão corretas
- O banco `curriculo_generator` foi criado

### PDF não está sendo gerado

Certifique-se de que:
- A biblioteca mPDF foi instalada via Composer
- A pasta `vendor` existe no projeto
- O PHP tem permissões de escrita

### Máscaras não funcionam

Verifique se:
- jQuery foi carregado antes do jQuery Mask Plugin
- Os scripts estão na ordem correta no HTML

## 👨‍💻 Autor

**Projeto Acadêmico - UNIPAR EAD**
- Disciplina: Fundamentos de Programação para Internet
- Professor: Carlos Eduardo Simões Pelegrin

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais.

## 🤝 Contribuições

Este é um projeto acadêmico, mas sugestões e melhorias são bem-vindas!

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com o tutor da disciplina.

---

⭐ Desenvolvido com dedicação para a disciplina de Fundamentos de Programação para Internet