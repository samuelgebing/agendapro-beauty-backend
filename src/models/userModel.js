const db = require('../config/database'); // Instância de conexão do banco de dados

const BaseModel = require("./baseModel");
// Importa a classe base para modelos

class UserModel extends BaseModel {
    constructor() {
        super('users', ['name', 'email', 'password_hash', 'role_id']);
        // 'role_id' deve ser verificado no service
    }

    // Busca um usuário pelo email
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?',
            [email]);
        return rows[0];
    }

    // Busca um usuário pelo role_id
    static async findByRoleId(role_id) {
        const [rows] = await db.execute('SELECT * FROM roles WHERE id = ?',
            [role_id]);
        return rows[0];
    }
}

module.exports = UserModel;
// Exporta a classe UserModel para ser usada nos services
