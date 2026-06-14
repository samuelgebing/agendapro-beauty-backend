const ProfessionalModel = require("../models/professionalModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela profissionais)

class ProfessionalService {
    // Busca todos os profissionais cadastrados
    static async getAllProfessionals() {
        return await ProfessionalModel.findAll();
    }

    // FAZER: getAllProfessionalsBySpecialty(especialidade_id)

    // Cria um novo profissional após validações
    static async createProfessional(professional) {
        // FAZER: validar a especialidade do profissional
            // professionalModel.js --> findSpecialtyById(professional.especialidade_id)
            // specialtyModel.js --> findById(professional.especialidade_id)

        return await ProfessionalModel.create(professional); // Cria o novo profissional
    }

    // Atualiza informações de um profissional existente
    static async updateProfessional(id, professional) {
        // FAZER: validar a especialidade do profissional
            // professionalModel.js --> findSpecialtyById(professional.especialidade_id)
            // specialtyModel.js --> findById(professional.especialidade_id)
            
        const updatedRows = await ProfessionalModel.update(id, professional);
        if (updatedRows === 0) {
            throw new Error("Profissional não encontrado."); // Caso nenhum profissional tenha sido atualizado
        }
        return updatedRows;
    }

    // Deleta um profissional pelo ID
    static async deleteProfessional(id) {
        const deletedRows = await ProfessionalModel.delete(id);
        if (deletedRows === 0) {
            throw new Error("Profissional não encontrado."); // Caso nenhum profissional tenha sido deletado
        }
        return deletedRows;
    }
}

module.exports = ProfessionalService;
// Exporta a classe para ser utilizada pelos controllers
