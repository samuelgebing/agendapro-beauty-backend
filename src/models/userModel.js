const db = require('../config/database');
// Importa a conexão pool com o banco de dados

class UserModel {
    // Busca todos os usuários
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    }

    // Busca um usuário pelo email
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?',
            [email]);
        return rows[0];
    }

    // Cria um novo usuário
    static async create(user) {
        const { name, email, password_hash, role_id } = user;
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
            [name, email, password_hash, role_id]
        );
        return result.insertId; // Retorna o ID do usuário criado
    }

    // Atualiza um usuário existente
    static async update(id, user) {
        const { name, email, password_hash, role_id } = user;
        const [result] = await db.query(
            'UPDATE users SET name = ?, email = ?, password_hash = ?, role_id = ? WHERE id = ? ',
            [name, email, password_hash, role_id, id]
        );
        return result.affectedRows; // Retorna o número de linhas afetadas
    }

    // Deleta um usuário pelo ID
    static async delete(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows; // Retorna o número de linhas afetadas
    }
}

module.exports = UserModel;
// Exporta a classe UserModel para ser usada nos services
