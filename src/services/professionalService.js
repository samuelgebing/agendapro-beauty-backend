const ProfessionalModel = require("../models/professionalModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela profissionais)

const validatePhone = require("../utils/validatePhone");
// Importa a função de validação de telefone do arquivo validatePhone.js
const ValidateId = require("../utils/validateId");
// Importa a classe para validar IDs

class ProfessionalService {
    // Valida os dados do profissional antes de criar ou atualizar
    static async validateProfessional(professional) {
        if (
            !professional || 
            Object.keys(professional).length === 0 
        ) {
            const error = new Error("Profissional não fornecido.");
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error;
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (!professional.nome) errors.push("Nome do profissional não fornecido.");
        if (!professional.telefone) errors.push("Telefone do profissional não fornecido.");
        if (ValidateId.isNull(professional.especialidade_id)) 
            errors.push("Especialidade do profissional não fornecida.");
        
        if (!professional.ativo && professional.ativo !== 0) 
            professional.ativo = 1; 
        // Define status padrão como 1 (ativo) caso não seja fornecido
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO PROFISSIONAL: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

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
        
        // VALIDAÇÕES DE STATUS DO PROFISSIONAL ("ATIVO")
        if (
            typeof professional.ativo !== "number" ||
            ![0,1].includes(professional.ativo)
        )
            errors.push("Status do profissional com formato inválido");

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO PROFISSIONAL: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

        // Verifica se o id da especialidade do profissional já existe no banco apenas se as demais validações passarem
        const existingSpecialtyId = await ProfessionalModel.findByEspecialidadeId(professional.especialidade_id);
        if (!existingSpecialtyId || existingSpecialtyId == ""){
            const error = new Error("Especialidade do profissional não encontrada.");
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error;
        }

        // Verifica se o profissional já existe no banco apenas se as demais validações passarem
        const existingName = await ProfessionalModel.findByNome(professional.nome);
        if (existingName){
            const error = new Error("Profissional já cadastrado, forneça outro nome.");
            error.statusCode = 409; // Define o status HTTP para 409 (conflito)
            throw error;
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    // Busca todos os profissionais cadastrados
    static async getAllProfessionals(especialidade_id) {
        // Busca os serviços filtrados por área do salão, se area_id for fornecido
        if (especialidade_id) {
            return await ProfessionalModel.findByEspecialidadeId(especialidade_id);
        }

        return await ProfessionalModel.findAll();
    }

    // FAZER: getAllProfessionalsBySpecialty(especialidade_id)

    // Cria um novo profissional após validações
    static async createProfessional(professional) {
        await this.validateProfessional(professional); // Chama a função de validação

        return await ProfessionalModel.create(professional); // Cria o novo profissional
    }

    // Atualiza informações de um profissional existente
    static async updateProfessional(id, professional) {
        ValidateId.primaryKey(id); // Chama a função de validação do id
        await this.validateProfessional(professional); // Chama a função de validação

        const updatedRows = await ProfessionalModel.update(id, professional);
        if (updatedRows === 0) {
            const error = new Error("Profissional não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }
        return updatedRows;
    }

    // Deleta um profissional pelo ID
    static async deleteProfessional(id) {
        ValidateId.primaryKey(id); // Chama a função de validação do id
        
        const deletedRows = await ProfessionalModel.delete(id);
        if (deletedRows === 0) {
            const error = new Error("Profissional não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }
        return deletedRows;
    }
}

module.exports = ProfessionalService;
// Exporta a classe para ser utilizada pelos controllers
