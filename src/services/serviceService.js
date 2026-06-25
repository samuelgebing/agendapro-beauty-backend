// SPRINT 2: filtro - Listagem de serviços filtrada por área do salão
// SPRINT 2: validação - Validação básica dos dados recebidos (campos obrigatórios, tipos)

const ServiceModel = require("../models/serviceModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela serviços)

class ServiceService {

    // Valida os dados do serviço antes de criar ou atualizar
    static async validateService(service) {
        if (!service) {
            const error = new Error("Serviço não fornecido.");
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error;
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (!service.nome) errors.push("Nome do serviço não fornecido.");
        if (!service.preco) errors.push("Preço do serviço não fornecido.");
        if (!service.area_id) errors.push("Área do serviço não fornecida.");
        if (!service.duracao_min) errors.push("Duração do serviço não fornecida.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO SERVIÇO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

        // VALIDAÇÕES DE NOME
        if (typeof service.nome !== "string") 
            errors.push("Nome com formato inválido.");
        if (service.nome.length < 2 || service.nome.length > 100) 
            errors.push("Nome deve ter entre 2 e 100 caracteres.");

        // VALIDAÇÕES DE PREÇO
        if (typeof service.preco !== "number" || service.preco <= 0) 
            errors.push("Preço com formato inválido.");

        // VALIDAÇÕES DE DURAÇÃO
        if (typeof service.duracao_min !== "number" || service.duracao_min <= 0) 
            errors.push("Duração com formato inválido.");

        // FAZER: Implementar validação de área_id
        // VALIDAÇÕES DE AREA_ID
        if (typeof service.area_id !== "number" || service.area_id <= 0) 
            errors.push("Área do serviço com formato inválido.");
        
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO SERVIÇO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

        // Verifica se o serviço já existe no banco apenas se as demais validações passarem
        const existingName = await ServiceModel.findByNome(service.nome);
        if (existingName){
            const error = new Error("Serviço já cadastrado, forneça outro nome.");
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error;
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }
    
    static async getAllServices(area_id) {
        // Busca os serviços filtrados por área do salão, se area_id for fornecido
        if (area_id) {
            return await ServiceModel.findByArea(area_id);
        }

        // Busca todos os serviços cadastrados
        return await ServiceModel.findAll();
    }

    /*
    // Busca serviços por área do salão
    static async getAllServicesByArea(area_id) {
        return await ServiceModel.findByArea(area_id);
    }
    */

    // Cria um novo serviço após validações
    static async createService(service) {
        // FAZER: validar a área do serviço
            // serviceModel.js --> findAreaById(service.area_id)
            // areaModel.js --> findById(service.area_id)

        this.validateService(service); // Chama a função de validação

        return await ServiceModel.create(service); // Cria o novo serviço
    }

    // Atualiza informações de um serviço existente
    static async updateService(id, service) {
        // FAZER: validar a área do serviço
            // serviceModel.js --> findAreaById(service.area_id)
            // areaModel.js --> findById(service.area_id)

        this.validateService(service); // Chama a função de validação
        
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
