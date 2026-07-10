const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const ServiceService = require('../services/serviceService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class ServiceController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(ServiceService, "Serviço");
    }

    // Método específico para listar todos os horários de um serviço específico
    getAvailableSchedules = async (req, res, next) => {
        try {
            const service_id = req.params.id;
            const { professional_id, date } = req.query;
            const schedules = await new ServiceService().getAvailableSchedules(service_id, professional_id, date);
            res.status(200).json(schedules);
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }
}

module.exports = new ServiceController();
// Exporta o Controller para ser usado nas rotas