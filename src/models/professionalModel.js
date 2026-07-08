const db = require('../config/database'); // Instância de conexão do banco de dados

const BaseModel = require('./baseModel');
// Importa a classe base para modelos

class ProfessionalModel extends BaseModel {
    constructor() {
        super('professionals', ['name', 'speciality_id', 'phone', 'active']);
        // 'active' está presente apenas no update, pois no create o default é 1 (ativo)
        // 'speciality_id' deve ser verificado no service
    }

    static async findBySpecialityId(speciality_id) {
        // console.log('SELECT p.id, p.name, p.speciality_id, p.phone, p.active FROM professionals p, specialities s WHERE s.id = ? AND p.speciality_id = s.id');
        const [rows] = await db.execute(
            'SELECT p.id, p.name, p.speciality_id, p.phone, p.active FROM professionals p, specialities s WHERE s.id = ? AND p.speciality_id = s.id', 
            [speciality_id]);
        return rows;
    }

    // Busca um profissional pelo nome
    static async findByName(name) {
        const [rows] = await db.execute('SELECT * FROM professionals WHERE name = ?',
            [name]);
        return rows[0];
    }

    // FAZER?: findByPhone(telefone)

    // FAZER?: findBySpecialty(especialidade)
}

module.exports = ProfessionalModel;
// Exporta a classe ProfessionalModel para ser usada nos services
