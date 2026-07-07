const db = require('../config/database');
// Importa a conexão pool com o banco de dados

const BaseModel = require('./baseModel');
// Importa a classe base para modelos

class BlockedHoursModel extends BaseModel {
    constructor() {
        super('blocked_hours', ['professional_id', 'start', 'end', 'reason']);
        // 'professional_id' deve ser verificado no service
    }
}

module.exports = BlockedHoursModel;
// Exporta a classe BlockedHoursModel para ser usada nos services
