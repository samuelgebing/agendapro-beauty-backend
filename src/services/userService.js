const bcrypt = require('bcryptjs'); // Biblioteca para criptografia de senhas
const jwt = require('jsonwebtoken'); // Biblioteca para geração de tokens JWT
const UserModel = require("../models/userModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela usuários)
const validateEmail = require("../utils/validateEmail");
// Importa a função utilitária que valida o formato de e-mail

// Classe que contém os serviços relacionados ao usuário, como registro e login
class UserService {
    // Busca todos os usuários cadastrados
    static async getAllUsers() {
        return await UserModel.findAll();
    }

    // Cria um novo usuário após validações
    static async createUser(user) {
        if (!validateEmail(user.email)) {
            throw new Error("Formato de email inválido."); // Valida o formato do e-mail
        }

        const existingUser = await UserModel.findByEmail(user.email);
        if (existingUser) {
            throw new Error("Email já cadastrado."); // Impede cadastro de e-mails
        }

        // Criptografa a senha antes de salvar no banco
        const hashed = await bcrypt.hash(user.senha_hash, 10);

        // Substitui a senha original pela criptografada
        user.senha_hash = hashed;

        return await UserModel.create(user); // Cria o novo usuário
    }

    // Atualiza informações de um usuário existente
    static async updateUser(id, user) {
        const updatedRows = await UserModel.update(id, user);
        if (updatedRows === 0) {
            throw new Error("Usuário não encontrado."); // Caso nenhum usuário tenha sido atualizado
        }
        return updatedRows;
    }

    // Deleta um usuário pelo ID
    static async deleteUser(id) {
        const deletedRows = await UserModel.delete(id);
        if (deletedRows === 0) {
            throw new Error("Usuário não encontrado."); // Caso nenhum usuário tenha sido deletado
        }
        return deletedRows;
    }

    // Método para autenticar o usuário e gerar token JWT
    static async loginUser({ email, senha_hash }) {
        // Busca o usuário pelo e-mail
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        console.log(user);
        console.log(senha_hash);
        // Verifica se a senha fornecida é válida
        const valid = await bcrypt.compare(senha_hash, user.senha_hash);
        if (!valid) {
            throw new Error('Senha inválida');
        }

        // Gera o token JWT
        const token = jwt.sign(
            { email: user.email, role: user.perfil_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Retorna o token e o usuário para o controller
        return { token, user: { email: user.email, role: user.perfil_id } };
    }
}

module.exports = UserService;
// Exporta a classe para ser utilizada pelos controllers
