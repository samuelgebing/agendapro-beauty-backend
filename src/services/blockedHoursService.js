const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const BlockedHoursModel = require("../models/blockedHoursModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)
const ProfessionalModel = require("../models/professionalModel");
// Importa o Model para validar o professional_id

class BlockedHoursService extends BaseService {
    constructor() {
        super(BlockedHoursModel);
    }

    // Valida os dados do horário antes de criar ou atualizar
    // OBS: sem id
    async validate(blockedHour) {
        // Verifica se o objeto blockedHour foi fornecido, caso contrário lança um erro
        if (
            !blockedHour || 
            Object.keys(blockedHour).length === 0
        ) {
            throw new this.ValidationError("Bloqueio de Horário não fornecido.");
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (this.ValidateId.isNull(blockedHour.professional_id)) 
            errors.push("Profissional não fornecido.");
        if (!blockedHour.start) errors.push("Data de início do bloqueio não fornecida.");
        if (!blockedHour.end) errors.push("Data de término do bloqueio não fornecida.");
        if (!blockedHour.reason) errors.push("Motivo não fornecido.");
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new this.ValidationError(errors.join(" ")); // Cria um erro com todas as mensagens de validação
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // VALIDAÇÕES DE PROFESSIONAL_ID
        if (this.ValidateId.isInvalid(blockedHour.professional_id)) 
            errors.push("Profissional com formato inválido.");

        // FAZER: 
        // VALIDAÇÕES DE DATA DE INÍCIO E TÉRMINO
        if (typeof blockedHour.start !== "string") 
            errors.push("Data de início com formato inválido.");
        if (typeof blockedHour.end !== "string") 
            errors.push("Data de término com formato inválido.");

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingProfessionalId = await new ProfessionalModel().findById(blockedHour.professional_id);
        if (!existingProfessionalId || existingProfessionalId == ""){
            throw new this.NotFoundError("Profissional não encontrado.");
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    /**
     * Valida os filtros recebidos pela URL 
     * EX: (?speciality_id=1)
     */
    async validateFilters(filters, resourceName) {
        // Se o usuário passou o filtro professional_id na URL
        
        this.ValidateId.primaryKey(filters.professional_id, resourceName);
        
        // Adicionar validações para outros filtros da URL aqui...
    }
}

module.exports = BlockedHoursService;
// Exporta a classe para ser utilizada pelos controllers
