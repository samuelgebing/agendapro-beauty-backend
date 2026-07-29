const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const UserModel = require("../models/userModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela users)
const validateEmail = require("../utils/validateEmail");
// Importa a função utilitária que valida o formato de e-mail
const bcrypt = require('bcryptjs'); // Biblioteca para criptografia de senhas
const jwt = require('jsonwebtoken'); // Biblioteca para geração de tokens JWT

class UserService extends BaseService {
    constructor() {
        super(UserModel);
    }

    // Valida os dados do usuário antes de criar ou atualizar
    async validate(user) {
        // Verifica se o objeto user foi fornecido, caso contrário lança um erro
        if (!user) {
            throw new this.ValidationError("Usuário não fornecido.");
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (!user.name) errors.push("Nome do usuário não fornecido.");
        if (!user.email) errors.push("E-mail do usuário não fornecido.");
        if (!user.password_hash) errors.push("Senha do usuário não fornecida.");
        if (this.ValidateId.isNull(user.role_id)) user.role_id = 1; 
        // Define perfil_id padrão como 1 (cliente) caso não seja fornecido
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO USUÁRIO: " + errors[0];
            throw new this.ValidationError(errors.join(" "));
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // FAZER: Implementar validação de perfil_id (opcional, mas se fornecido deve ser válido)
        // VALIDAÇÕES DE PERFIL_ID
        // Formato
        if (this.ValidateId.isInvalid(user.role_id))
            errors.push("Perfil com formato inválido.");
        else {
            // Unicidade
            const existingRole = await UserModel.findByRoleId(user.role_id);
            if (!existingRole)
                throw new this.NotFoundError("Perfil não encontrado."); // Impede cadastro de perfis não existentes
        }

        // VALIDAÇÕES DE NOME
        if (typeof user.name !== "string") 
            errors.push("Nome com formato inválido.");
        if (user.name.length < 2 || user.name.length > 100) 
            errors.push("Nome deve ter entre 2 e 100 caracteres.");

        // FAZER: Transformar senha_hash em hash antes de salvar no banco de dados (ex: bcrypt)
        // VALIDAÇÕES DE SENHA
        if (typeof user.password_hash !== "string") 
            errors.push("Senha com formato inválido.");
        if (user.password_hash.length < 6 || user.password_hash.length > 255) 
            errors.push("Senha deve ter mais de 6 caracteres.");
        // FAZER: Implementar validação de complexidade de senha (ex: letras maiúsculas, minúsculas, números, caracteres especiais)

        // VALIDAÇÕES DE E-MAIL
        // Formato
        if (!validateEmail(user.email))
            errors.push("E-mail com formato inválido.");
        else {
            // Unicidade
            const existingEmail = await UserModel.findByEmail(user.email);
            if (Array.isArray(existingEmail) && existingEmail.length > 0) {
                // No caso de alteração do usuário, envia-se o id
                if (existingEmail.id === user.id)
                    throw new this.ConflictError("E-mail já cadastrado."); // Impede cadastro de e-mails duplicados
            }
        }        

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO USUÁRIO: " + errors[0];
            throw new this.ValidationError(errors.join(" "));
        }

        // CONVERSÃO DE SENHA (APENAS SE TUDO FOR VÁLIDO)        
        // Criptografa a senha antes de salvar no banco
        const hashed = await bcrypt.hash(user.password_hash, 10);

        // Substitui a senha original pela criptografada
        user.password_hash = hashed;
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    /**
     * Valida os filtros recebidos pela URL 
     * EX: (?role_id=1)
     */
    async validateFilters(filters) {
        // Se o usuário passou o filtro role_id na URL
        if (filters.role_id)
            this.ValidateId.primaryKey(filters.role_id, "Perfil");
                
        // Adicionar validações para outros filtros da URL aqui...

        return filters;
    }

    update = async (id, data, resourceName = "Registro") => {
        this.ValidateId.primaryKey(id, resourceName); // Valida o ID antes de buscar
        // Insere o id como valor para permitir alteração de outros dados, repetindo o e-mail
        data = {id, ...data};
        await this.validate(data); 
        // Retira o id para passar nas validações da Model
        delete data.id;

        const item = await this.model.update(id, data);
        if (!item || item === 0) 
            throw new NotFoundError(`${resourceName} não encontrado para atualização.`);
        
        return item; 
    }
    
    // Método para autenticar o usuário e gerar token JWT
    login = async (data, resourceName = "Registro") => {
        const { email, password_hash } = data;

        // Busca o usuário pelo e-mail
        const [user] = await this.model.findByEmail(email);
        if (!user) {
            throw new this.NotFoundError(`${resourceName} não encontrado`);
        }

        // Verifica se a senha fornecida é válida
        const valid = await bcrypt.compare(password_hash, user.password_hash);
        if (!valid) {
            throw new this.ValidationError(`${resourceName} com senha inválida`);
        }

        // Gera o token JWT
        const token = jwt.sign(
            { email: user.email, role: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // APENAS VALIDAR AS ROTAS - middleware
        
        // Retorna o token e o usuário para o controller
        return { token, user: { email: user.email, role_id: user.role_id } };
    }
}

module.exports = UserService;
// Exporta a classe para ser utilizada pelos controllers
