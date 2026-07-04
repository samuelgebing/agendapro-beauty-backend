const BaseModel = require("./baseModel");
// Importa a classe base para modelos

class ScheduleModel extends BaseModel {
    constructor() {
        super('working_hours', ['professional_id', 'weekday', 'start_hour', 'end_hour']);
        // professional_id deve ser verificado no service
    }
}

module.exports = ScheduleModel;
// Exporta a classe ScheduleModel para ser usada nos services
