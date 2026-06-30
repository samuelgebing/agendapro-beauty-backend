const ServiceModel = require("../models/serviceModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela serviços)
const ValidateId = require("../utils/validateId");
// Importa a classe para validar IDs

class ServiceService {
    
    // Valida os dados do serviço antes de criar ou atualizar
    // OBS: sem id
    static async validateService(service) {
        if (
            !service || 
            Object.keys(service).length === 0
        ) {
            const error = new Error("Serviço não fornecido.");
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error;
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (!service.name) errors.push("Nome do serviço não fornecido.");
        if (!service.price) errors.push("Preço do serviço não fornecido.");
        if (ValidateId.isNull(service.area_id)) 
            errors.push("Área do serviço não fornecida.");
        if (!service.min_duration) errors.push("Duração do serviço não fornecida.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO SERVIÇO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
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
        if (ValidateId.isInvalid(service.area_id)) 
            errors.push("Área do serviço com formato inválido.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO SERVIÇO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

        // Verifica se o serviço já existe no banco apenas se as demais validações passarem
        const existingName = await ServiceModel.findByName(service.name);
        if (existingName){
            const error = new Error("Serviço já cadastrado, forneça outro nome.");
            error.statusCode = 409; // Define o status HTTP para 409 (conflito)
            throw error;
        }

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingAreaId = await ServiceModel.findByAreaId(service.area_id);
        if (!existingAreaId || existingAreaId == ""){
            const error = new Error("Área do serviço não encontrada.");
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error;
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }
    
    static async getAllServices(area_id) {
        // Busca os serviços filtrados por área do salão, se area_id for fornecido
        if (area_id) {
            ValidateId.isInvalid(area_id,'Área do Serviço');
            
            return await ServiceModel.findByAreaId(area_id);
        }

        // Busca todos os serviços cadastrados
        return await ServiceModel.findAll();
    }

    // Cria um novo serviço após validações
    static async createService(service) {
        await this.validateService(service); // Chama a função de validação

        return await ServiceModel.create(service); // Cria o novo serviço
    }

    // Atualiza informações de um serviço existente
    static async updateService(id, service) {
        ValidateId.primaryKey(id,'Serviço'); // Chama a função de validação do id
        await this.validateService(service); // Chama a função de validação geral
        
        const updatedRows = await ServiceModel.update(id, service);
        if (updatedRows === 0) {
            const error = new Error("Serviço não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }
        return updatedRows;
    }

    // Deleta um serviço pelo ID
    static async deleteService(id) {
        ValidateId.primaryKey(id,'Serviço'); // Chama a função de validação do id

        const deletedRows = await ServiceModel.delete(id);
        if (deletedRows === 0) {
            const error = new Error("Serviço não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }
        return deletedRows;
    }
}

module.exports = ServiceService;
// Exporta a classe para ser utilizada pelos controllers
