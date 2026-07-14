const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const ProfessionalModel = require("../models/professionalModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela profissionais)

const validatePhone = require("../utils/validatePhone");
// Importa a função de validação de telefone do arquivo validatePhone.js

class ProfessionalService extends BaseService {
    constructor() {
        super(ProfessionalModel);
    }

    // Valida os dados do profissional antes de criar ou atualizar
    async validate(professional) {
        if (
            !professional || 
            Object.keys(professional).length === 0 
        ) {
            throw new this.ValidationError("Profissional não fornecido.");
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (!professional.name) errors.push("Nome do profissional não fornecido.");
        if (!professional.phone) errors.push("Telefone do profissional não fornecido.");
        if (this.ValidateId.isNull(professional.speciality_id)) 
            errors.push("Especialidade do profissional não fornecida.");
        
        if (!professional.active && professional.active !== 0) 
            professional.active = 1; 
        // Define status padrão como 1 (ativo) caso não seja fornecido
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO PROFISSIONAL: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new this.ValidationError(errors.join(" ")); // Cria um erro com todas as mensagens de validação
        }

        // VALIDAÇÕES DE NOME
        if (typeof professional.name !== "string") 
            errors.push("Nome com formato inválido.");
        if (professional.name.length < 2 || professional.name.length > 100) 
            errors.push("Nome deve ter entre 2 e 100 caracteres.");

        // VALIDAÇÕES DE TELEFONE
        if (!validatePhone(professional.phone))
            errors.push("Formato de telefone inválido - o formato deve ser (xx) xxxxx-xxxx ou (xx) xxxx-xxxx.");

        // FAZER: Verificação da existência da especialidade_id no banco de dados
        // VALIDAÇÕES DE ESPECIALIDADE
        if (this.ValidateId.isInvalid(professional.speciality_id)) 
            errors.push("Especialidade com formato inválido.");
        
        // VALIDAÇÕES DE STATUS DO PROFISSIONAL ("ATIVO")
        if (
            typeof professional.active !== "number" ||
            ![0,1].includes(professional.active)
        )
            errors.push("Status do profissional com formato inválido");

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO PROFISSIONAL: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new this.ValidationError(errors.join(" ")); // Cria um erro com todas as mensagens de validação
        }

        // Verifica se o id da especialidade do profissional já existe no banco apenas se as demais validações passarem
        const existingSpecialityId = await this.model.findBySpecialityId(professional.speciality_id);
        if (!existingSpecialityId || existingSpecialityId == ""){
            throw new this.NotFoundError("Especialidade do profissional não encontrada.");
        }

        // Verifica se o profissional já existe no banco apenas se as demais validações passarem
        const existingName = await this.model.findByName(professional.name);
        if (existingName){
            throw new this.ConflictError("Profissional já cadastrado, forneça outro nome.");
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    /**
     * Valida os filtros recebidos pela URL 
     * EX: (?speciality_id=1)
     */
    async validateFilters(filters, resourceName) {
        // Se o usuário passou o filtro speciality_id na URL
        
        this.ValidateId.primaryKey(filters.speciality_id, resourceName);
        
        // Adicionar validações para outros filtros da URL aqui...
    }

    async getWorkingHoursByWeekday(professional_id, weekday) {
        this.ValidateId.primaryKey(professional_id, "Profissional");
        if(![0,1,2,3,4,5,6].includes(weekday))
            throw new this.ValidationError("Dia da semana com formato inválido.");

        const workingHours = await this.workingHoursModel.findOneBy(professional_id, weekday);
        return workingHours;
    }
    
    async getAgenda(professional_id, date = null) {
        const service = await this.getById(service_id, "Serviço");
        if (!this.ValidateId.isNull(professional_id)) {
            this.ValidateId.isInvalid(professional_id, "Profissional");
            // validar data - UTILS
            // é opcional

            if (date) {
                const professionalSchedules = await this.findAllSchedules(professional_id, date);
            } else {
                const professionalSchedules = await this.findAllSchedules(professional_id);
            }
            return {
                service,
                professionalSchedules
            };
        } else {
            // Se professional_id não for fornecido, apenas retorna o serviço
            return { service };
        }

        this.ValidateId.primaryKey(professional_id, "Profissional"); // Valida o ID antes de buscar
        const schedules = await this.model.findAllSchedules(professional_id);
        return schedules;
    }

    static async findAllSchedules(professionalId) {
        const professional = await this.getById(professionalId, "Profissional");         
        const blockedHours = await this.findBlockedHours(professionalId);
        const workingHours = await this.findWorkingHours(professionalId);

        return {
            ...professional,
            blockedHours,
            workingHours
        };
    }

    get workingHoursModel() {
        if (!this._serviceService) {
            const WorkingHoursModel = require("../models/workingHoursModel");
            // Importa o Model para validar o user_id
            this._workingHoursModel = new WorkingHoursModel();
        }
        return this._workingHoursModel;
    }
}

module.exports = ProfessionalService;
// Exporta a classe para ser utilizada pelos controllers
