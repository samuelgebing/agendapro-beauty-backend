USE agendapro_beauty;

-- Inserting mock data
INSERT INTO blocked_hours (professional_id, start, end, reason) VALUES
(1, '2026-01-01 00:00', '2026-01-31 23:59', 'Férias de verão'),
(1, '2026-07-15 00:00', '2026-07-31 23:59', 'Férias de inverno'),
(2, '2026-02-01 00:00', '2026-02-28 23:59', 'Manutenção do salão'),
(3, '2026-03-01 00:00', '2026-03-15 23:59', 'Evento especial'),
(4, '2026-04-01 00:00', '2026-04-30 23:59', 'Treinamento de equipe');