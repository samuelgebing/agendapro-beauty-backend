const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const ServiceModel = require("../models/serviceModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela serviços)

const ProfessionalService = require("./professionalService");
// Importa o serviço de profissionais para validação de horários disponíveis
const ScheduleService = require("./scheduleService");
// Importa o serviço de horários para validação de horários disponíveis

class ServiceService extends BaseService {
    constructor() {
        super(ServiceModel);
    }

    // Evita o travamento circular ao carregar o ScheduleService
    get scheduleService() {
        if (!this._scheduleService) {
            this._scheduleService = new ScheduleService();
        }
        return this._scheduleService;
    }

    // Evita o travamento circular ao carregar o ProfessionalService
    get professionalService() {
        if (!this._professionalService) {
            this._professionalService = new ProfessionalService();
        }
        return this._professionalService;
    }

    // Valida os dados do serviço antes de criar ou atualizar
    // OBS: sem id
    async validate(service) {
        if (
            !service || 
            Object.keys(service).length === 0
        ) {
            throw new this.ValidationError("Serviço não fornecido.");
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (!service.name) errors.push("Nome do serviço não fornecido.");
        if (!service.price) errors.push("Preço do serviço não fornecido.");
        if (this.ValidateId.isNull(service.area_id)) 
            errors.push("Área do serviço não fornecida.");
        if (!service.min_duration) errors.push("Duração do serviço não fornecida.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO SERVIÇO: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new this.ValidationError(errors.join(" ")); // Lança um erro de validação padrão
        }

        // VALIDAÇÕES DE NOME
        if (typeof service.name !== "string") 
            errors.push("Nome com formato inválido.");
        if (service.name.length < 2 || service.name.length > 100) 
            errors.push("Nome deve ter entre 2 e 100 caracteres.");

        // VALIDAÇÕES DE PREÇO
        if (typeof service.price !== "number" || service.price <= 0) 
            errors.push("Preço com formato inválido.");

        // VALIDAÇÕES DE DURAÇÃO
        if (typeof service.min_duration !== "number" || service.min_duration <= 0) 
            errors.push("Duração com formato inválido.");

        // VALIDAÇÕES DE AREA_ID
        if (this.ValidateId.isInvalid(service.area_id)) 
            errors.push("Área do serviço com formato inválido.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO SERVIÇO: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new this.ValidationError(errors.join(" ")); // Lança um erro de validação padrão
        }

        // Verifica se o serviço já existe no banco apenas se as demais validações passarem
        const existingName = await ServiceModel.findByName(service.name);
        if (existingName){
            throw new this.ConflictError("Serviço já cadastrado, forneça outro nome.");
        }

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingAreaId = await ServiceModel.findByAreaId(service.area_id);
        if (!existingAreaId || existingAreaId == ""){
            throw new this.NotFoundError("Área do serviço não encontrada.");
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    /**
     * Valida os filtros recebidos pela URL 
     * EX: (?area_id=1)
     */
    async validateFilters(filters) {
        // Se o usuário passou o filtro area_id na URL
        if (filters.area_id)
            this.ValidateId.primaryKey(filters.area_id, "Área do Serviço");
        
        // Adicionar validações para outros filtros da URL aqui...

        return filters;
    }

    async getAllAgenda(service_id) {

    }

    async getAvailableSchedules(service_id, professional_id = null, date = null) {
        // Schedules
        // GET {{baseURL}}/services/{{service_id}}/schedules
        // GET {{baseURL}}/services/{{service_id}}/schedules?professional_id=1
        // GET {{baseURL}}/services/{{service_id}}/schedules?professional_id=1&date=2026-06-20
        const service = await this.getById(service_id, "Serviço"); 
        const minDuration = service.min_duration;
        /*
        const professionalSchedules = await new ProfessionalService().findAllSchedules(professional_id);
        this.ValidateId.primaryKey(professional_id, "Profissional"); // Valida o ID antes de buscar
        */

        const professional = await this.professionalService.getById(professional_id, "Profissional");
        
        // validar data - UTILS
        // lembrar que é opcional

        const potencialSlots = await this.scheduleService.generatePotentialSlots(professional_id, minDuration, date);
        /*
        // Busca os horários disponíveis para o serviço, profissional e data fornecidos
        const schedules = await new ScheduleModel().findAvailableSchedules(
            service_id, professional_id, date, minDuration
        );

        if (!schedules || schedules.length === 0) {
            throw new this.NotFoundError("Nenhum horário disponível encontrado.");
        }
        */

        const schedules = await this.scheduleService.getAll( 
            professional_id,
            service_id
        );

        const agenda = await this.scheduleService._getDayAgenda(potencialSlots, schedules);
        
        return { 
            service, 
            professional,
            agenda
        };
    }
}

module.exports = ServiceService;
// Exporta a classe para ser utilizada pelos controllers
