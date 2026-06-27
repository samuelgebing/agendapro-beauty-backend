const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class ServiceModel {
    // Busca todos os serviços
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM services');
        return rows;
    }

    // Busca um serviço pela área do salão
    static async findByAreaId(area_id) {
        const query = 'SELECT s.id, s.area_id, s.name, s.min_duration, s.price FROM services s, areas a WHERE a.id = ? AND s.area_id = a.id';
        const [rows] = await db.query(query, [area_id]);
        return rows;
    }

    // Busca um serviço pelo nome
    static async findByName(name) {
        const [rows] = await db.query('SELECT * FROM services WHERE name = ?',
            [name]);
        return rows[0];
    }

    // Cria um novo serviço
    static async create(service) {
        const { name, area_id, min_duration, price } = service;
        const [result] = await db.query(
            'INSERT INTO services (name, area_id, min_duration, price) VALUES (?, ?, ?, ?)',
            [name, area_id, min_duration, price]
        );
        return result.insertId; // Retorna o ID do serviço criado
    }

    // Atualiza um serviço existente
    static async update(id, service) {
        const { name, area_id, min_duration, price } = service;
        const [result] = await db.query(
            'UPDATE services SET name = ?, area_id = ?, min_duration = ?, price = ? WHERE id = ? ',
            [name, area_id, min_duration, price, id]
        );
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um serviço pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = ServiceModel;
// Exporta a classe ServiceModel para ser usada nos services
