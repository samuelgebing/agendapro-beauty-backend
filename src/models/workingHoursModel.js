const db = require('../config/database');
// Importa a conexão pool com o banco de dados

const BaseModel = require('./baseModel');
// Importa a classe base para modelos

class WorkingHoursModel extends BaseModel {
    constructor() {
        super('working_hours', ['professional_id', 'weekday', 'start_hour', 'end_hour']);
        // 'professional_id' deve ser verificado no service
    }

    static async findByProfessionalId(professionalId) {
        const [rows] = await db.execute(
            'SELECT * FROM working_hours WHERE professional_id = ?',
            [professionalId]
        );
        return rows;
    }

    static async findByProfessionalAndWeekday(professionalId, weekday) {
        const [rows] = await db.execute(
            'SELECT * FROM working_hours WHERE professional_id = ? AND weekday = ?',
            [professionalId, weekday]
        );
        return rows;
    }
}

module.exports = WorkingHoursModel;
// Exporta a classe WorkingHoursModel para ser usada nos services
