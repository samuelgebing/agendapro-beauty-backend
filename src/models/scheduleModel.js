const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class ScheduleModel {
    // Busca todos os horários
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM working_hours');
        return rows;
    }

    // Busca um horário pelo ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM working_hours WHERE id = ?', [id]);
        return rows[0];
    }

    // Cria um novo horário
    static async create(schedule) {
        const { professional_id, weekday, start_hour, end_hour } = schedule;
        const [result] = await db.query(
            'INSERT INTO working_hours (professional_id, weekday, start_hour, end_hour) VALUES (?, ?, ?, ?)',
            [professional_id, weekday, start_hour, end_hour]
        );
        return result.insertId; // Retorna o ID do horário criado
    }

    // Atualiza um horário existente
    static async update(id, schedule) {
        const { professional_id, weekday, start_hour, end_hour } = schedule;
        const [result] = await db.query(
            'UPDATE working_hours SET professional_id = ?, weekday = ?, start_hour = ?, end_hour = ? WHERE id = ? ',
            [professional_id, weekday, start_hour, end_hour, id]
        );
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um horário pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM working_hours WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = ScheduleModel;
// Exporta a classe ScheduleModel para ser usada nos services
