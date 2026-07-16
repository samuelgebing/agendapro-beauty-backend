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

        // VALIDAÇÕES DE HORA INICIAL E FINAL
        if (this.ValidateTime.isInvalid(workingHour.start_hour)) 
            errors.push("Data de início com formato inválido.");
        if (this.ValidateTime.isInvalid(workingHour.end_hour)) 
            errors.push("Data de término com formato inválido.");

        if (workingHour.start_hour >= workingHour.end_hour)
            errors.push("Hora de início deve ser menor que a hora final.");

        // VALIDAÇÕES DE PROFESSIONAL_ID
        if (this.ValidateId.isInvalid(workingHour.professional_id)) 
            errors.push("ID de profissional com formato inválido.");

        // VALIDAÇÕES DE DIA DA SEMANA
        if (![0,1,2,3,4,5,6].includes(workingHour.weekday))
            errors.push("Dia da semana com formato inválido.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new this.ValidationError(errors.join(" ")); // Cria um erro com todas as mensagens de validação
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingProfessionalId = await ProfessionalModel.findById(workingHour.professional_id);
        if (!existingProfessionalId || existingProfessionalId == ""){
            throw new this.NotFoundError("Profissional não encontrado.");
        }

        // Verifica se já não existe cadastro totalmente igual
        const conflict = await this.model.findConflicts(
            workingHour.professional_id, 
            workingHour.weekday, 
            workingHour.start_hour, 
            workingHour.end_hour
        );
        if (conflict.length > 0)
            throw new this.ConflictError("Horário de trabalho já cadastrado para esse profissional.");
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    /**
     * Valida os filtros recebidos pela URL 
     * EX: (?speciality_id=1)
     */
    async validateFilters(filters, resourceName) {
        // Se o usuário passou o filtro professional_id na URL
        if (filters.professional_id)
            this.ValidateId.primaryKey(filters.professional_id, resourceName);
        
        // Adicionar validações para outros filtros da URL aqui...

        return filters;
    }
}

module.exports = WorkingHoursService;
// Exporta a classe para ser utilizada pelos controllers
