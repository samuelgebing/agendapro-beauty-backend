const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const ServiceModel = require("../models/serviceModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela serviços)

class ServiceService extends BaseService {
    constructor() {
        super(ServiceModel);
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
        
        this.ValidateId.primaryKey(filters.area_id, "Área do Serviço");
        
        // Adicionar validações para outros filtros da URL aqui...
    }
}

module.exports = ServiceService;
// Exporta a classe para ser utilizada pelos controllers
