const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class ProfessionalModel {
    // Busca todos os profissionais
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM professionals');
        return rows;
    }

    static async findBySpecialityId(speciality_id) {
        // console.log('SELECT p.id, p.name, p.speciality_id, p.phone, p.active FROM professionals p, specialities s WHERE s.id = ? AND p.speciality_id = s.id');
        const [rows] = await db.query(
            'SELECT p.id, p.name, p.speciality_id, p.phone, p.active FROM professionals p, specialities s WHERE s.id = ? AND p.speciality_id = s.id', 
            [speciality_id]);
        return rows;
    }

    // Busca um profissional pelo nome
    static async findByName(name) {
        const [rows] = await db.query('SELECT * FROM professionals WHERE name = ?',
            [name]);
        return rows[0];
    }

    // FAZER?: findByPhone(telefone)

    // FAZER?: findBySpecialty(especialidade)

    // Cria um novo profissional
    static async create(professional) {
        // FAZER: validar especialidade_id conforme tabela especialidades

        // O campo "ativo" tem como default "true" no banco
        const { name, speciality_id, phone } = professional;
        const [result] = await db.query(
            'INSERT INTO professionals (name, speciality_id, phone) VALUES (?, ?, ?)',
            [name, speciality_id, phone]
        );
        return result.insertId; // Retorna o ID do profissional criado
    }

    // Atualiza um profissional existente
    static async update(id, professional) {
        // FAZER: validar especialidade_id conforme tabela especialidades

        // Aqui o campo "ativo" entra para o caso de atualização
        const { name, speciality_id, phone, active } = professional;
        const [result] = await db.query(
            'UPDATE professionals SET name = ?, speciality_id = ?, phone = ?, active = ? WHERE id = ? ',
            [name, speciality_id, phone, active, id]
        );
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um profissional pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM professionals WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = ProfessionalModel;
// Exporta a classe ProfessionalModel para ser usada nos services
