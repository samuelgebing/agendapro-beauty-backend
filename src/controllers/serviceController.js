const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const ServiceService = require('../services/serviceService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class ServiceController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(ServiceService, "Serviço");
    }
}

module.exports = new ServiceController();
// Exporta o Controller para ser usado nas rotas