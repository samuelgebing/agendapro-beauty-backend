const BaseController = require('./baseController'); 
// Importa a classe base com os métodos CRUD genéricos
const UserService = require('../services/userService'); 
const { ConflictError } = require('../utils/appErrors');
// Importa o serviço específico com a lógica de negócio para manipular

class UserController extends BaseController {
    constructor() {
        // Passa o serviço específico e as mensagens personalizadas para o construtor pai (BaseController)
        super(UserService, "Usuário", {
            loginSuccess: "Login realizado com sucesso"
        });
    }

    update = async (req, res, next) => {
        try {
            const data = await this.service.update(req.params.id, req.body, this.resourceName);
            return res.status(200).json({
                message: this.messages.updateSuccess,
                data
            });
        } catch (error) {
            // Para o caso de usar um e-mail já presente em outro usuário
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                // Se o erro mencionar o campo email
                if (error.sqlMessage && error.sqlMessage.includes('.email')) {
                    const emailError = new ConflictError("Este e-mail já está sendo utilizado por outro usuário.", { 
                        cause: error 
                    });
                    
                    next(emailError);
                }
            }

            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }

    login = async (req, res, next) => {
        try {
            const data = await this.service.login(req.body, this.resourceName);
            return res.status(200).json({
                message: this.messages.loginSuccess,
                data
            });
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }
}

module.exports = new UserController();
// Exporta o Controller para ser usado nas rotas