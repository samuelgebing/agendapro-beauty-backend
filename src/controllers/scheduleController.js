const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const ScheduleService = require('../services/scheduleService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class ScheduleController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(ScheduleService, "Horário");
    }
}

module.exports = new ScheduleController();
// Exporta o Controller para ser usado nas rotas