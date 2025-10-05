CREATE DATABASE IF NOT EXISTS curriculo_generator;
USE curriculo_generator;

CREATE TABLE curriculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    data_nascimento DATE,
    estado_civil VARCHAR(20),
    objetivo TEXT,
    resumo_profissional TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

CREATE TABLE experiencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curriculo_id INT NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    descricao TEXT,
    atual BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curriculo_id) REFERENCES curriculos(id) ON DELETE CASCADE,
    INDEX idx_curriculo (curriculo_id)
);

CREATE TABLE formacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curriculo_id INT NOT NULL,
    instituicao VARCHAR(255) NOT NULL,
    curso VARCHAR(255) NOT NULL,
    nivel VARCHAR(50),
    data_inicio DATE,
    data_fim DATE,
    status VARCHAR(50) DEFAULT 'Em andamento',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curriculo_id) REFERENCES curriculos(id) ON DELETE CASCADE,
    INDEX idx_curriculo (curriculo_id)
);

CREATE TABLE habilidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curriculo_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    nivel VARCHAR(50) DEFAULT 'Intermediário',
    tipo VARCHAR(50) DEFAULT 'Técnica',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curriculo_id) REFERENCES curriculos(id) ON DELETE CASCADE,
    INDEX idx_curriculo (curriculo_id)
);

CREATE TABLE idiomas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curriculo_id INT NOT NULL,
    idioma VARCHAR(100) NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curriculo_id) REFERENCES curriculos(id) ON DELETE CASCADE,
    INDEX idx_curriculo (curriculo_id)
);