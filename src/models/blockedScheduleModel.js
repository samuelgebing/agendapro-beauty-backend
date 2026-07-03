const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class BlockedScheduleModel {
    // Busca todos os bloqueios de horário
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM blocked_schedules');
        return rows;
    }

    // Busca um bloqueio de horário pelo ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM blocked_schedules WHERE id = ?', [id]);
        return rows[0];
    }

    // Cria um novo bloqueio de horário
    static async create(schedule) {
        const { professional_id, start, end, reason } = schedule;
        const [result] = await db.query(
            'INSERT INTO blocked_schedules (professional_id, start, end, reason) VALUES (?, ?, ?, ?)',
            [professional_id, start, end, reason]
        );
        return result.insertId; // Retorna o ID do bloqueio de horário criado
    }

    // Atualiza um bloqueio de horário existente
    static async update(id, schedule) {
        const { professional_id, start, end, reason } = schedule;
        const [result] = await db.query(
            'UPDATE blocked_schedules SET professional_id = ?, start = ?, end = ?, reason = ? WHERE id = ? ',
            [professional_id, start, end, reason, id]
        );
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um bloqueio de horário pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM blocked_schedules WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = BlockedScheduleModel;
// Exporta a classe BlockedScheduleModel para ser usada nos services
