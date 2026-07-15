const db = require('../config/database');
// Importa a conexão pool com o banco de dados

const BaseModel = require('./baseModel');
// Importa a classe base para modelos

class WorkingHoursModel extends BaseModel {
    constructor() {
        super('working_hours', ['professional_id', 'weekday', 'start_hour', 'end_hour']);
        // 'professional_id' deve ser verificado no service
    }

    async findByProfessionalId(professionalId) {
        const rows = await this.findOneBy({'professional_id' : professionalId});
        return rows || [];
    }

    async findByProfessionalAndWeekday(professionalId, weekday) {
        const rows = await this.findAll({
            'professional_id' : professionalId,
            'weekday' : weekday
        });
        return rows || [];
    }

    /**
     * Busca agendamentos ativos de um profissional em uma data específica
     * Evita que horários sejam sobrepostos na agenda
     */
    async findConflicts(professionalId, weekday, startHour, endHour) {
        const rows = await this.findAll({
            'professional_id' : professionalId,
            'weekday' : weekday, 
            'start_hour' : startHour,
            'end_hour' : endHour
        });
        return rows || [];         
    }
}

module.exports = new WorkingHoursModel();
// Exporta a classe WorkingHoursModel para ser usada nos services
