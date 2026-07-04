const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const ServiceService = require('../services/serviceService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class ServiceController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(ServiceService, "Serviço");
    }

    /*
    // Método para listar todos os serviços
    static async getAll(req, res) {
        try {
            // Se a URL for /services, area_id será undefined (Falso no IF do Service)
            // Se for /services?area_id=1, area_id será '1' (Verdadeiro no IF do Service)
            const { area_id } = req.query;

            const services = await ServiceService.getAllServices(area_id);

            res.json(services); // Retorna a lista em formato JSON
        } catch (error) {
            if(!error.statusCode) error.statusCode = 500; 
            // Se não houver statusCode, define como 500 (erro interno)
            res.status(error.statusCode).json({ error: error.message }); // Em caso de erro, retorna status 500(erro interno)
        }
    }
    */
}

module.exports = new ServiceController();
// Exporta o Controller para ser usado nas rotas