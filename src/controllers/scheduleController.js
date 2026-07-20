const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const ScheduleService = require('../services/scheduleService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class ScheduleController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(ScheduleService, "Agendamento");
    }

    updateStatus = async (req, res, next) => {
        try {
            const data = await this.service.updateStatus(req.params.id, req.body, this.resourceName);
            return res.status(200).json({
                message: this.messages.updateSuccess,
                data
            });
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }
}

module.exports = new ScheduleController();
// Exporta o Controller para ser usado nas rotas