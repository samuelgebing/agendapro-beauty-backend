const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class ServiceModel {
    // Busca todos os serviços
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM servicos');
        return rows;
    }

    // Busca um serviço pela área do salão
    static async findByArea(area_id) {
        const [rows] = await db.query('SELECT * FROM servicos WHERE area_id = ?',
            [area_id]);
        return rows;
    }

    // Busca um serviço pelo nome
    static async findByNome(nome) {
        const [rows] = await db.query('SELECT * FROM servicos WHERE nome = ?',
            [nome]);
        return rows[0];
    }

    // Cria um novo serviço
    static async create(service) {
        const { nome, area_id, duracao_min, preco, duracao } = service;
        const [result] = await db.query(
            'INSERT INTO servicos (nome, area_id, duracao_min, preco, duracao) VALUES (?, ?, ?, ?, ?)',
            [nome, area_id, duracao_min, preco, duracao]
        );
        return result.insertId; // Retorna o ID do serviço criado
    }

    // Atualiza um serviço existente
    static async update(id, service) {
        const { nome, area_id, duracao_min, preco, duracao } = service;
        const [result] = await db.query(
            'UPDATE servicos SET nome = ?, area_id = ?, duracao_min = ?, preco = ?, duracao = ? WHERE id = ? ',
            [nome, area_id, duracao_min, preco, duracao, id]
        );
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um serviço pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM servicos WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = ServiceModel;
// Exporta a classe ServiceModel para ser usada nos services
