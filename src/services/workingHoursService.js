const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const WorkingHoursModel = require("../models/workingHoursModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)
const ProfessionalModel = require("../models/professionalModel");
// Importa o Model para validar o professional_id

class WorkingHoursService extends BaseService {
    constructor() {
        super(WorkingHoursModel);
    }

    // Valida os dados do horário antes de criar ou atualizar
    // OBS: sem id
    async validate(workingHour) {
        // Verifica se o objeto workingHour foi fornecido, caso contrário lança um erro
        if (
            !workingHour || 
            Object.keys(workingHour).length === 0
        ) {
            throw new this.ValidationError("Horário de trabalho não fornecido.");
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (this.ValidateId.isNull(workingHour.professional_id)) 
            errors.push("Profissional não fornecido.");
        if (!workingHour.start_hour) errors.push("Hora inicial não fornecida.");
        if (!workingHour.end_hour) errors.push("Hora final não fornecida.");
        if (!workingHour.weekday) errors.push("Dia da semana não fornecido.");
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new this.ValidationError(errors.join(" ")); // Cria um erro com todas as mensagens de validação
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // VALIDAÇÕES DE PROFESSIONAL_ID
        if (this.ValidateId.isInvalid(workingHour.professional_id)) 
            errors.push("Profissional com formato inválido.");

        /*
        // FAZER: 
        // VALIDAÇÕES DE DATA INICIAL E FINAL
        if (typeof workingHour.start_hour !== "string") 
            errors.push("Data de início com formato inválido.");
        if (typeof workingHour.end_hour !== "string") 
            errors.push("Data de término com formato inválido.");

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }
        */

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingProfessionalId = await new ProfessionalModel().findById(workingHour.professional_id);
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

module.exports = WorkingHoursService;
// Exporta a classe para ser utilizada pelos controllers
