const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const AgendaService = require('../services/agendaService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class AgendaController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(AgendaService, "Agenda");
    }

    // Arrow functions garantem que o escopo do 'this' não se perca no Express
    getAgenda = async (req, res, next) => {
        try {
            // req.query captura automaticamente restrições da URL
            // EX: { area_id: '1', professional_id = '2' } da URL /services?area_id=1&professional_id=2
            const filters = req.query; 

            const data = await this.service.getAgenda(filters, this.resourceName);
            return res.status(200).json(data);
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }
}

module.exports = new AgendaController();
// Exporta o Controller para ser usado nas rotas