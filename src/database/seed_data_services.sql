USE agendapro_beauty;

-- Inserting mock data
INSERT INTO areas (name, description) VALUES
('Cabelo', 'Serviços relacionados a cabelo'),
('Unhas', 'Serviços relacionados a unhas'),
('Maquiagem', 'Serviços relacionados a maquiagem');

INSERT INTO services (name, area_id, min_duration, price) VALUES
('Corte de Cabelo', 1, 30, 60.00),
('Corte e Hidratação de Cabelo', 1, 45, 100.00),
('Manicure', 2, 30, 40.00),
('Pedicure', 2, 30, 40.00),
('Manicure e Pedicure', 2, 60, 80.00),
('Maquiagem', 3, 120, 160.00);
