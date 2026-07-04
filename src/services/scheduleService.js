const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const ScheduleModel = require("../models/scheduleModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)
const ProfessionalModel = require("../models/professionalModel");
// Importa o Model para validar o professional_id

class ScheduleService extends BaseService {
    constructor() {
        super(ScheduleModel);
    }

    // Valida os dados do horário antes de criar ou atualizar
    // OBS: sem id
    async validate(schedule) {
        // Verifica se o objeto schedule foi fornecido, caso contrário lança um erro
        if (
            !schedule || 
            Object.keys(schedule).length === 0
        ) {
            throw new this.ValidationError("Horário não fornecido.");
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (this.ValidateId.isNull(schedule.professional_id)) 
            errors.push("Profissional não fornecido.");
        if (!schedule.weekday) errors.push("Dia da semana não fornecido.");
        if (!schedule.start_hour) errors.push("Hora de início não fornecida.");
        if (!schedule.end_hour) errors.push("Hora de término não fornecida.");
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0];
            throw new this.ValidationError(errors.join(" "));
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // VALIDAÇÕES DE DIA DA SEMANA
        if (![0,1,2,3,4,5,6].includes(Number(schedule.weekday))) 
            errors.push("Dia da semana com formato inválido.");

        // VALIDAÇÕES DE PROFESSIONAL_ID
        if (this.ValidateId.isInvalid(schedule.professional_id)) 
            errors.push("Profissional com formato inválido.");

        // FAZER: 
        // VALIDAÇÕES DE HORA DE INÍCIO E TÉRMINO
        if (typeof schedule.start_hour !== "string") 
            errors.push("Hora de início com formato inválido.");
        if (typeof schedule.end_hour !== "string") 
            errors.push("Hora de término com formato inválido.");

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0];
            throw new this.ValidationError(errors.join(" "));
        }

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingProfessionalId = await new ProfessionalModel().findById(schedule.professional_id);
        if (!existingProfessionalId || existingProfessionalId == ""){
            throw new this.NotFoundError("Profissional não encontrado.");
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    /**
     * Valida os filtros recebidos pela URL 
     * EX: (?professional_id=1)
     */
    async validateFilters(filters) {
        // Se o horário passou o filtro professional_id na URL
        
        this.ValidateId.primaryKey(filters.professional_id, "Profissional");
        
        // Adicionar validações para outros filtros da URL aqui...
    }
}

module.exports = ScheduleService;
// Exporta a classe para ser utilizada pelos controllers
