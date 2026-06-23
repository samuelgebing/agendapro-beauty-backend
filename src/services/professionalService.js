const ProfessionalModel = require("../models/professionalModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela profissionais)

const validatePhone = require("../utils/validatePhone");
// Importa a função de validação de telefone do arquivo validatePhone.js

class ProfessionalService {
    // Valida os dados do profissional antes de criar ou atualizar
    static validateProfessional(professional) {
        if (!professional) throw new Error("Profissional não fornecido.");

        const errors = [];
        // Verifica campos obrigatórios
        if (!professional.nome) errors.push("Nome do profissional não fornecido.");
        if (!professional.telefone) errors.push("Telefone do profissional não fornecido.");
        if (!professional.especialidade_id) errors.push("Especialidade do profissional não fornecida.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO PROFISSIONAL: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new Error(errors.join(" ")); // Lança um erro com todas as mensagens de validação
        }
        
        if (!professional.ativo) professional.ativo = 1; 
        // Define status padrão como 1 (ativo) caso não seja fornecido

        // VALIDAÇÕES DE NOME
        if (typeof professional.nome !== "string") 
            errors.push("Nome com formato inválido.");
        if (professional.nome.length < 2 || professional.nome.length > 100) 
            errors.push("Nome deve ter entre 2 e 100 caracteres.");

        // VALIDAÇÕES DE TELEFONE
        if (!validatePhone(professional.telefone))
            errors.push("Formato de telefone inválido - o formato deve ser (xx) xxxxx-xxxx ou (xx) xxxx-xxxx.");

        // FAZER: Verificação da existência da especialidade_id no banco de dados
        // VALIDAÇÕES DE ESPECIALIDADE
        if (
            typeof professional.especialidade_id !== "number" || 
            !Number.isInteger(professional.especialidade_id)  ||
            professional.especialidade_id <= 0
        ) 
            errors.push("Especialidade com formato inválido.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO PROFISSIONAL: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new Error(errors.join(" ")); // Lança um erro com todas as mensagens de validação
        }

    }

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

        this.validateProfessional(professional); // Chama a função de validação

        return await ProfessionalModel.create(professional); // Cria o novo profissional
    }

    // Atualiza informações de um profissional existente
    static async updateProfessional(id, professional) {
        // FAZER: validar a especialidade do profissional
            // professionalModel.js --> findSpecialtyById(professional.especialidade_id)
            // specialtyModel.js --> findById(professional.especialidade_id)

        this.validateProfessional(professional); // Chama a função de validação

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
