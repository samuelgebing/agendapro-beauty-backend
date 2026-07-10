const db = require('../config/database');
// Importa a conexão pool com o banco de dados

const BaseModel = require('./baseModel');
// Importa a classe base para modelos

class BlockedHoursModel extends BaseModel {
    constructor() {
        super('blocked_hours', ['professional_id', 'start', 'end', 'reason']);
        // 'professional_id' deve ser verificado no service
    }

    static async findByProfessionalId(professionalId) {
        const [rows] = await db.execute(
            'SELECT * FROM blocked_hours WHERE professional_id = ?',
            [professionalId]
        );
        return rows;
    }
    
    static async findByProfessionalAndDate(professionalId, startDate, endDate) {
        const [rows] = await db.execute(
            `SELECT * FROM blocked_hours 
             WHERE professional_id = ? 
                AND start >= ? 
                AND end <= ?`,
            [professionalId, startDate, endDate]
        );
        return rows;
    }
}

module.exports = BlockedHoursModel;
// Exporta a classe BlockedHoursModel para ser usada nos services
