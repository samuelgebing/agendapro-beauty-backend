const db = require('../config/database');
// Importa a conexão pool com o banco de dados

const BaseModel = require('./baseModel');
// Importa a classe base para modelos

class BlockedHoursModel extends BaseModel {
    constructor() {
        super('blocked_hours', ['professional_id', 'start', 'end', 'reason']);
        // 'professional_id' deve ser verificado no service
    }

    async findByProfessionalId(professionalId) {
        const rows = await this.findAll({'professional_id' : professionalId});
        return rows || [];
    }
    
    // Precisa do sql por causa dos parâmetros específicos
    async findByProfessionalAndDate(professionalId, startDate, endDate) {
        const [rows] = await db.execute(
            `SELECT * FROM blocked_hours 
             WHERE professional_id = ? 
                AND start <= ?
                AND end >= ?`,
            [professionalId, endDate, startDate]
        );
        return rows;
    }
    
    // Precisa do sql por causa dos parâmetros específicos
    async findByDate(start,end) {
        const [rows] = await db.execute(
            `SELECT * FROM blocked_hours 
             WHERE start <= ? 
                AND end >= ?`,
            [end, start]
        );
        return rows;
    }
}

module.exports = new BlockedHoursModel();
// Exporta a classe BlockedHoursModel para ser usada nos services
