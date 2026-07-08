const db = require('../config/database'); // Instância de conexão do banco de dados

const BaseModel = require("./baseModel");
// Importa a classe base para modelos

class ServiceModel extends BaseModel {
    constructor() {
        super('services', ['name', 'area_id', 'min_duration', 'price']);
        // 'area_id' deve ser verificado no service
    }

    // Busca um serviço pela área do salão
    static async findByAreaId(area_id) {
        const query = 'SELECT s.id, s.area_id, s.name, s.min_duration, s.price FROM services s, areas a WHERE a.id = ? AND s.area_id = a.id';
        const [rows] = await db.execute(query, [area_id]);
        return rows;
    }

    // Busca um serviço pelo nome
    static async findByName(name) {
        const [rows] = await db.execute('SELECT * FROM services WHERE name = ?',
            [name]);
        return rows[0];
    }
}

module.exports = ServiceModel;
// Exporta a classe ServiceModel para ser usada nos services
