const BaseModel = require("./baseModel");

class ScheduleStatusModel extends BaseModel {
    constructor() {
        // Envia o nome da tabela cobaia e o array de colunas permitidas
        super('schedule_status', ['name', 'description']);
    }
}

module.exports = new ScheduleStatusModel();
