const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class ProfessionalModel {
    // Busca todos os profissionais
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM profissionais');
        return rows;
    }

    // FAZER: findAllBySpecialty(especialidade_id)

    // Busca um profissional pelo nome
    static async findByName(nome) {
        const [rows] = await db.query('SELECT * FROM profissionais WHERE nome = ?',
            [nome]);
        return rows[0];
    }

    // FAZER?: findByPhone(telefone)

    // FAZER?: findBySpecialty(especialidade)

    // Cria um novo profissional
    static async create(professional) {
        // FAZER: validar especialidade_id conforme tabela especialidades

        // O campo "ativo" tem como default "true" no banco
        const { nome, especialidade_id, telefone } = professional;
        const [result] = await db.query(
            'INSERT INTO profissionais (nome, especialidade_id, telefone) VALUES (?, ?, ?)',
            [nome, especialidade_id, telefone]
        );
        return result.insertId; // Retorna o ID do profissional criado
    }

    // Atualiza um profissional existente
    static async update(id, professional) {
        // FAZER: validar especialidade_id conforme tabela especialidades

        // Aqui o campo "ativo" entra para o caso de atualização
        const { nome, especialidade_id, telefone, ativo } = professional;
        const [result] = await db.query(
            'UPDATE profissionais SET nome = ?, especialidade_id = ?, telefone = ?, ativo = ? WHERE id = ? ',
            [nome, especialidade_id, telefone, ativo, id]
        );
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um profissional pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM profissionais WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = ProfessionalModel;
// Exporta a classe ProfessionalModel para ser usada nos services
