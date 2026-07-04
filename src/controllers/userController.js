const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const UserService = require('../services/userService'); 
// Importa o serviço específico com a lógica de negócio para manipular

class UserController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(UserService, "Usuário");
    }
}

module.exports = new UserController();
// Exporta o Controller para ser usado nas rotas