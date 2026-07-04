const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const ScheduleService = require('../services/scheduleService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class ScheduleController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(ScheduleService, "Horário");
    }

    /*
    // Método para listar todos os horários de profissionais
    static async getAll(req, res) {
        try {
            //FAZER
            // Se a URL for /schedules, professional_id será undefined (Falso no IF do Schedule)
            // Se for /schedules?professional_id=1, professional_id será '1' (Verdadeiro no IF do Schedule)
            const { professional_id } = req.query;

            const schedules = await ScheduleService.getAllSchedules(professional_id);

            res.json(schedules); // Retorna a lista em formato JSON
        } catch (error) {
            if(!error.statusCode) error.statusCode = 500; 
            // Se não houver statusCode, define como 500 (erro interno)
            res.status(error.statusCode).json({ error: error.message }); // Em caso de erro, retorna status 500(erro interno)
        }
    }
    */
}

module.exports = new ScheduleController();
// Exporta o Controller para ser usado nas rotas