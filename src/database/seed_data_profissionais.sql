-- Usa o banco
USE agendapro_beauty;

-- Inserção de dados fictícios
INSERT INTO especialidades (nome) VALUES
('Cabelo'),
('Unhas'),
('Maquiagem');

INSERT INTO profissionais (nome, especialidade_id, telefone, ativo) VALUES
('João da Silva', 1, '(54) 1111-1111', 1),
('Maria Oliveira', 2, '(54) 22222-2222', 1),
('Cabelereira Leila', 1, '(54) 99999-9999', 1),
('Samuel Gebing', 3, '(54) 99999-9999', 0);
