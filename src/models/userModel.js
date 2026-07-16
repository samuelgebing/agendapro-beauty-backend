const db = require('../config/database'); // Instância de conexão do banco de dados

const BaseModel = require("./baseModel");
// Importa a classe base para modelos

class UserModel extends BaseModel {
    constructor() {
        super('users', ['name', 'email', 'password_hash', 'role_id']);
        // 'role_id' deve ser verificado no service
    }

    // Busca um usuário pelo email
    async findByEmail(email) {
        const rows = await this.findAll({'email' : email});
        return rows || [];
    }

    // Busca um usuário pelo role_id
    async findByRoleId(role_id) {
        const rows = await this.findAll({'role_id' : role_id});
        return rows || [];
    }
}

module.exports = new UserModel();
// Exporta a classe UserModel para ser usada nos services
