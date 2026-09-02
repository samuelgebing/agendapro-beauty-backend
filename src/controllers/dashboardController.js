const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const DashboardService = require('../services/dashboardService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class DashboardController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(DashboardService, "Dashboard");
    }

    // Arrow functions garantem que o escopo do 'this' não se perca no Express
    getDashboard = async (req, res, next) => {
        try {
            // req.query captura automaticamente restrições da URL
            // EX: { service_id: '1', professional_id = '2' } da URL /dashboard?service_id=1&professional_id=2
            const filters = req.query; 

            const data = await this.service.getDashboard(filters, this.resourceName);
            return res.status(200).json(data);
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }
}

module.exports = new DashboardController();
// Exporta o Controller para ser usado nas rotas