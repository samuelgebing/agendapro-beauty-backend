USE agendapro_beauty;

-- Inserting mock data
INSERT INTO roles (name) VALUES
('Cliente'),
('Profissional'),
('Administrador');

INSERT INTO users (name, email, password_hash, role_id, created_at) VALUES
('João da Silva', 'joao@example.com', '$2b$10$iLPiW0hfaXklAGNvcfdhSejFmAAaYgYoH5UMklH0NIn7IWqKRzY1a', 1, CURRENT_TIMESTAMP),
('Maria Oliveira', 'maria@example.com', '$2b$10$kCLo9CkHAu2xtCIqG8e4ne7NaMLYEEpeDK2LbeSSqgLvJXM/8V88e', 1, CURRENT_TIMESTAMP),
('Cabelereira Leila', 'leila@example.com', '$2b$10$MUlOv7QTIS/Ho22/qg8csO6ty4EkEoWiDS/oWBPXXbLEWVLGE9C9i', 2, CURRENT_TIMESTAMP),
('Samuel Gebing', 'samuel@example.com', '$2b$10$Q7v/G8XQ/7AnxOxRc8IQt.8HNgoDZU4LYma89FdHq/afL/.dQeUvu', 3, CURRENT_TIMESTAMP);
