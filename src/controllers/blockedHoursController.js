const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const BlockedHoursService = require('../services/blockedHoursService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class BlockedHoursController extends BaseController {
    constructor() {
        // MÁGICA DO LAZY LOADING: O 'require' roda apenas quando a classe nasce.
        // Isso quebra a dependência circular do Node de uma vez por todas!
        const BlockedHoursService = require('../services/blockedHoursService');

        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(BlockedHoursService, "Bloqueio de Horário");
    }
}

module.exports = new BlockedHoursController();
// Exporta o Controller para ser usado nas rotas