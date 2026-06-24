const UserModel = require("../models/userModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela users)
const validateEmail = require("../utils/validateEmail");
// Importa a função utilitária que valida o formato de e-mail
class UserService {
    // Valida os dados do usuário antes de criar ou atualizar
    static validateUser(user) {
        // Verifica se o objeto user foi fornecido, caso contrário lança um erro
        if (!user) {
            const error = new Error("Usuário não fornecido.");
            error.statusCode = 400;
            throw error;
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (!user.nome) errors.push("Nome do usuário não fornecido.");
        if (!user.email) errors.push("E-mail do usuário não fornecido.");
        if (!user.senha_hash) errors.push("Senha do usuário não fornecida.");
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO USUÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // FAZER: Implementar validação de perfil_id (opcional, mas se fornecido deve ser válido)
        if (!user.perfil_id) user.perfil_id = 1; 
        // Define perfil_id padrão como 1 (cliente) caso não seja fornecido

        // VALIDAÇÕES DE NOME
        if (typeof user.nome !== "string") 
            errors.push("Nome com formato inválido.");
        if (user.nome.length < 2 || user.nome.length > 100) 
            errors.push("Nome deve ter entre 2 e 100 caracteres.");

        // FAZER: Transformar senha_hash em hash antes de salvar no banco de dados (ex: bcrypt)
        // VALIDAÇÕES DE SENHA
        if (typeof user.senha_hash !== "string") 
            errors.push("Senha com formato inválido.");
        if (user.senha_hash.length < 6 || user.senha_hash.length > 255) 
            errors.push("Senha deve ter mais de 6 caracteres.");
        // FAZER: Implementar validação de complexidade de senha (ex: letras maiúsculas, minúsculas, números, caracteres especiais)

        // VALIDAÇÕES DE E-MAIL
        // Formato
        if (!validateEmail(user.email))
            errors.push("E-mail com formato inválido.");
        else {
            // Unicidade
            const existingEmail = await UserModel.findByEmail(user.email);
            if (existingEmail)
                errors.push("E-mail já cadastrado."); // Impede cadastro de e-mails duplicados
        }        

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO USUÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    // Busca todos os usuários cadastrados
    static async getAllUsers() {
        return await UserModel.findAll();
    }

    // Cria um novo usuário após validações
    static async createUser(user) {
        this.validateUser(user); // Chama a função de validação
        return await UserModel.create(user); // Cria o novo usuário
    }

    // Atualiza informações de um usuário existente após validações
    static async updateUser(id, user) {
        this.validateUser(user); // Chama a função de validação

        const updatedRows = await UserModel.update(id, user);
        if (updatedRows === 0) {
            const error = new Error("Usuário não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }

        return updatedRows;
    }

    // Deleta um usuário pelo ID
    static async deleteUser(id) {
        const deletedRows = await UserModel.delete(id);
        if (deletedRows === 0) {
            const error = new Error("Usuário não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }

        return deletedRows;
    }
}

module.exports = UserService;
// Exporta a classe para ser utilizada pelos controllers
