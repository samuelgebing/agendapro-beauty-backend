-- Usa o banco
USE agendapro_beauty;

-- Inserção de dados fictícios
INSERT INTO perfis (nome) VALUES
('Cliente'),
('Profissional'),
('Administrador');

INSERT INTO usuarios (nome, email, senha_hash, perfil_id, criado_em) VALUES
('João da Silva', 'joao@example.com', '$2b$10$example_hash_1', 1, CURRENT_TIMESTAMP),
('Maria Oliveira', 'maria@example.com', '$2b$10$example_hash_2', 1, CURRENT_TIMESTAMP),
('Cabelereira Leila', 'leila@example.com', '$2b$10$example_hash_3', 2, CURRENT_TIMESTAMP),
('Samuel Gebing', 'samuel@example.com', '$2b$10$example_hash_4', 3, CURRENT_TIMESTAMP);
