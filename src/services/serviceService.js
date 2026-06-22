// SPRINT 2: filtro - Listagem de serviços filtrada por área do salão
// SPRINT 2: validação - Validação básica dos dados recebidos (campos obrigatórios, tipos)

const ServiceModel = require("../models/serviceModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela serviços)

class ServiceService {
    
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

        return await ServiceModel.create(service); // Cria o novo serviço
    }

    // Atualiza informações de um serviço existente
    static async updateService(id, service) {
        // FAZER: validar a área do serviço
            // serviceModel.js --> findAreaById(service.area_id)
            // areaModel.js --> findById(service.area_id)
            
        const updatedRows = await ServiceModel.update(id, service);
        if (updatedRows === 0) {
            throw new Error("Serviço não encontrado."); // Caso nenhum serviço tenha sido atualizado
        }
        return updatedRows;
    }

    // Deleta um serviço pelo ID
    static async deleteService(id) {
        const deletedRows = await ServiceModel.delete(id);
        if (deletedRows === 0) {
            throw new Error("Serviço não encontrado."); // Caso nenhum serviço tenha sido deletado
        }
        return deletedRows;
    }
}

module.exports = ServiceService;
// Exporta a classe para ser utilizada pelos controllers
