const BaseModel = require('./baseModel');
// Importa a classe base para modelos

class ProfessionalModel extends BaseModel {
    constructor() {
        super('professionals', ['name', 'speciality_id', 'phone', 'active']);
        // 'active' está presente apenas no update, pois no create o default é 1 (ativo)
        // 'speciality_id' deve ser verificado no service
    }

    async findBySpecialityId(speciality_id) {
        // console.log('SELECT p.id, p.name, p.speciality_id, p.phone, p.active FROM professionals p, specialities s WHERE s.id = ? AND p.speciality_id = s.id');
        const rows = await this.findAll({'speciality_id' : speciality_id});
        return rows || [];
    }

    // Busca um profissional pelo nome
    async findByName(name) {
        // Remove espaços em branco residuais nas pontas do nome antes de buscar
        const cleanName = name ? name.trim() : '';
        const row = await this.findOneBy({'name' : cleanName});
        return row; 
    }

    // FAZER?: findByPhone(telefone)
}

module.exports = new ProfessionalModel();
// Exporta a classe ProfessionalModel para ser usada nos services
