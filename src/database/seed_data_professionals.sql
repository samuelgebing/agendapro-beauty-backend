USE agendapro_beauty;

-- Inserting mock data
INSERT INTO specialities (name) VALUES
('Cabelo'),
('Unhas'),
('Maquiagem');

INSERT INTO professionals (name, speciality_id, phone, active) VALUES
('João da Silva', 1, '(54) 1111-1111', 1),
('Maria Oliveira', 2, '(54) 22222-2222', 1),
('Cabelereira Leila', 1, '(54) 99999-9999', 1),
('Samuel Gebing', 3, '(54) 99999-9999', 0);
