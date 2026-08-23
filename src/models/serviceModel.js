const db = require('../config/database'); // Instância de conexão do banco de dados

const BaseModel = require("./baseModel");
// Importa a classe base para modelos

class ServiceModel extends BaseModel {
    constructor() {
        super('services', ['name', 'area_id', 'min_duration', 'price']);
        // 'area_id' deve ser verificado no service
    }

    // Busca um serviço pela área do salão
    async findByAreaId(area_id) {
        // console.log(SELECT s.id, s.area_id, s.name, s.min_duration, s.price FROM services s, areas a WHERE a.id = ? AND s.area_id = a.id);
        const rows = await this.findAll({'area_id' : area_id});
        return rows || [];
    }

    // Busca um serviço pelo nome
    async findByName(name) {
        // Remove espaços em branco residuais nas pontas do nome antes de buscar
        const cleanName = name ? name.trim() : '';
        const row = await this.findOneBy({'name' : cleanName});
        return row; 
    }
}

module.exports = new ServiceModel();
// Exporta a classe ServiceModel para ser usada nos services
