# 🚀 Guia de Instalação - Gerador de Currículos

Este guia detalha passo a passo como instalar e configurar o sistema Gerador de Currículos em seu ambiente local.

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- ✅ **XAMPP** (ou WAMP/LAMP) - Servidor Apache + MySQL + PHP
- ✅ **Composer** - Gerenciador de dependências PHP
- ✅ **Navegador Web** - Chrome, Firefox, Edge ou Safari
- ✅ **Editor de Código** - VS Code, Sublime Text ou similar (opcional)

## 📥 Passo 1: Instalar o XAMPP

### Windows

1. Baixe o XAMPP em: https://www.apachefriends.org/
2. Execute o instalador
3. Selecione os componentes: **Apache**, **MySQL** e **PHP**
4. Escolha o diretório de instalação (padrão: `C:\xampp`)
5. Complete a instalação
6. Inicie o **XAMPP Control Panel**

### Verificar Instalação

1. Abra o XAMPP Control Panel
2. Clique em **Start** para Apache
3. Clique em **Start** para MySQL
4. Abra o navegador e acesse: `http://localhost`
5. Você deve ver a página de boas-vindas do XAMPP

## 📥 Passo 2: Instalar o Composer

### Windows

1. Baixe o Composer em: https://getcomposer.org/download/
2. Execute o `Composer-Setup.exe`
3. Selecione o PHP do XAMPP: `C:\xampp\php\php.exe`
4. Complete a instalação

### Verificar Instalação

```bash
composer --version
```

Deve exibir algo como: `Composer version 2.x.x`

## 📁 Passo 3: Baixar o Projeto

### Opção 1: Via Git (Recomendado)

```bash
cd C:\xampp\htdocs
git clone https://github.com/ViniciusCostaGrillo/gerador_curriculos
cd curriculo-generator
```

### Opção 2: Download Manual

1. Baixe o ZIP do projeto
2. Extraia para `C:\xampp\htdocs\curriculo-generator`

## 🔧 Passo 4: Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
composer install
```

Isso irá:
- Criar a pasta `vendor/`
- Instalar a biblioteca mPDF
- Configurar o autoload

**Aguarde** até que todas as dependências sejam instaladas.

## 🗄️ Passo 5: Criar o Banco de Dados

### Método 1: Via phpMyAdmin (Mais Fácil)

1. Certifique-se que o MySQL está rodando no XAMPP
2. Abra o navegador e acesse: `http://localhost/phpmyadmin`
3. Clique em **Novo** na barra lateral
4. Nome do banco: `curriculo_generator`
5. Collation: `utf8_general_ci`
6. Clique em **Criar**
7. Selecione o banco criado
8. Clique em **Importar**
9. Escolha o arquivo `schema.sql` do projeto
10. Clique em **Executar**

### Método 2: Via Linha de Comando

```bash
mysql -u root -p
```

Quando solicitar senha, pressione **Enter** (padrão do XAMPP não tem senha).

```sql
CREATE DATABASE curriculo_generator CHARACTER SET utf8 COLLATE utf8_general_ci;
USE curriculo_generator;
SOURCE C:/xampp/htdocs/curriculo-generator/schema.sql;
EXIT;
```

### Verificar Criação

No phpMyAdmin, você deve ver:
- ✅ Database: `curriculo_generator`
- ✅ Tabela: `curriculos`
- ✅ Tabela: `experiencias`
- ✅ Tabela: `formacoes`
- ✅ Tabela: `habilidades`
- ✅ Tabela: `idiomas`

## ⚙️ Passo 6: Configurar Conexão com Banco

1. Abra o arquivo: `config/database.php`
2. Verifique/ajuste as configurações:

```php
private $host = "localhost";
private $db_name = "curriculo_generator";
private $username = "root";
private $password = ""; // Deixe vazio para XAMPP padrão
```

3. Salve o arquivo

## 🧪 Passo 7: Testar a Conexão

1. Certifique-se que Apache e MySQL estão rodando
2. Abra o navegador
3. Acesse: `http://localhost/curriculo-generator/api/teste_conexao.php`
4. Deve exibir: **"Conexão OK!"**

**Se der erro:**
- Verifique se MySQL está rodando
- Verifique as credenciais em `database.php`
- Verifique se o banco foi criado

## 🌐 Passo 8: Acessar o Sistema

Abra seu navegador e acesse:

```
http://localhost/curriculo-generator/
```

Você deve ver a **página inicial** do sistema!

## ✅ Passo 9: Testar Funcionalidades

### 1. Criar um Currículo de Teste

1. Clique em **"Criar Novo Currículo"**
2. Preencha os dados pessoais:
   - Nome: João Silva
   - Email: joao@email.com
   - Telefone: (11) 99999-9999
3. Adicione uma experiência
4. Adicione uma formação
5. Adicione uma habilidade
6. Clique em **"Salvar Currículo"**

### 2. Verificar no Banco

1. Acesse o phpMyAdmin
2. Vá em `curriculo_generator` → `curriculos`
3. Você deve ver o registro criado

### 3. Listar Currículos

1. Clique em **"Meus Currículos"**
2. Você deve ver o currículo criado

### 4. Gerar PDF

1. Na listagem, clique em **"Baixar PDF"**
2. O PDF deve ser gerado e baixado

## 🎨 Estrutura de Pastas Final

Sua estrutura deve estar assim:

```
C:\xampp\htdocs\curriculo-generator\
├── api/
├── config/
├── css/
├── js/
├── models/
├── vendor/          ← Criada pelo Composer
├── index.html
├── criar-curriculo.html
├── listar-curriculos.html
├── schema.sql
├── composer.json
└── README.md
```

## 🐛 Solução de Problemas Comuns

### Problema 1: "Erro de conexão com banco de dados"

**Solução:**
```
1. Abra XAMPP Control Panel
2. Clique em "Stop" no MySQL
3. Aguarde 5 segundos
4. Clique em "Start" no MySQL
5. Tente novamente
```

### Problema 2: "Class 'Mpdf\Mpdf' not found"

**Solução:**
```bash
# Na pasta do projeto
composer install
# ou
composer update
```

### Problema 3: "404 Not Found"

**Solução:**
```
1. Verifique se Apache está rodando
2. Verifique se o projeto está em: C:\xampp\htdocs\
3. Use o caminho correto: http://localhost/curriculo-generator/
```

### Problema 4: Página em branco ou erro 500

**Solução:**
```
1. Abra: C:\xampp\php\php.ini
2. Procure por: display_errors
3. Altere para: display_errors = On
4. Salve e reinicie o Apache
5. Veja o erro específico
```

### Problema 5: "Access denied for user 'root'@'localhost'"

**Solução:**
```php
// Em config/database.php
// Se você definiu senha no MySQL:
private $password = "sua_senha";

// Se não definiu (padrão XAMPP):
private $password = "";
```

### Problema 6: JavaScript não funciona

**Solução:**
```
1. Abra o Console do navegador (F12)
2. Vá na aba "Console"
3. Verifique se há erros
4. Verifique sua conexão com internet (CDN)
```

## 📱 Testar Responsividade

1. Abra o sistema no navegador
2. Pressione **F12** (DevTools)
3. Clique no ícone de **dispositivo móvel**
4. Teste diferentes resoluções

## 🔐 Segurança (Produção)

Se for colocar em produção:

1. **Altere as credenciais do banco**
2. **Configure senha no MySQL**
3. **Desabilite display_errors no php.ini**
4. **Configure HTTPS**
5. **Adicione validação extra**

## 📚 Próximos Passos

Agora que o sistema está funcionando:

1. ✅ Explore todas as funcionalidades
2. ✅ Crie vários currículos de teste
3. ✅ Teste a geração de PDF
4. ✅ Personalize o CSS conforme necessário
5. ✅ Grave o vídeo de demonstração

## 💡 Dicas Úteis

- **Ctrl + F5**: Atualizar página ignorando cache
- **F12**: Abrir DevTools para debug
- **Console do navegador**: Ver erros JavaScript
- **Network tab**: Ver requisições AJAX

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique o Console do navegador (F12)
2. Verifique os logs do Apache: `C:\xampp\apache\logs\error.log`
3. Verifique os logs do PHP
4. Consulte a documentação oficial das tecnologias

## ✨ Conclusão

Parabéns! 🎉 Seu sistema está instalado e funcionando!

Agora você pode:
- ✅ Criar currículos
- ✅ Listar currículos
- ✅ Gerar PDFs
- ✅ Usar todas as funcionalidades

---

**Bom desenvolvimento!** 💻🚀