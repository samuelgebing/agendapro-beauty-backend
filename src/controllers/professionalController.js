const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const ProfessionalService = require('../services/professionalService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class ProfessionalController extends BaseController {
    constructor() {
        // MÁGICA DO LAZY LOADING: O 'require' roda apenas quando a classe nasce.
        // Isso quebra a dependência circular do Node de uma vez por todas!
        const ProfessionalService = require('../services/professionalService');

        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(ProfessionalService, "Profissional");
    }

    /*
    // Método para listar todos os profissionais
    static async getAll(req, res) {
        try {
            // Se a URL for /professionals, speciality_id será undefined (Falso no IF do Service)
            // Se for /professionals?speciality_id=1, speciality_id será '1' (Verdadeiro no IF do Service)
            const { speciality_id } = req.query;

            const professionals = await ProfessionalService.getAllProfessionals(speciality_id); 
            // Chama o service para buscar profissionais

            res.json(professionals); // Retorna a lista em formato JSON
        } catch (error) {
            if(!error.statusCode) error.statusCode = 500; 
            // Se não houver statusCode, define como 500 (erro interno)
            res.status(error.statusCode).json({ error: error.message }); 
        }
    }
    */
}

module.exports = new ProfessionalController();
// Exporta o Controller para ser usado nas rotas