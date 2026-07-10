const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const WorkingHoursService = require('../services/workingHoursService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class WorkingHoursController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(WorkingHoursService, "Horário de trabalho");
    }
}

module.exports = new WorkingHoursController();
// Exporta o Controller para ser usado nas rotas