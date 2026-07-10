const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const ProfessionalService = require('../services/professionalService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class ProfessionalController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(ProfessionalService, "Profissional");
    }
}

module.exports = new ProfessionalController();
// Exporta o Controller para ser usado nas rotas