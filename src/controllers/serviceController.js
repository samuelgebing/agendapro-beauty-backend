// SPRINT 2: CRUD para serviços
const ServiceService = require('../services/serviceService');
// Importa o serviço que contém a lógica de negócio para manipular serviços

class ServiceController {
    // Método para listar todos os serviços
    static async getAll(req, res) {
        try {
            // Se a URL for /services, area_id será undefined (Falso no IF do Service)
            // Se for /services?area_id=1, area_id será '1' (Verdadeiro no IF do Service)
            const { area_id } = req.query;

            const services = await ServiceService.getAllServices(area_id);

            res.json(services); // Retorna a lista em formato JSON
        } catch (error) {
            res.status(500).json({ error: error.message }); // Em caso de erro, retorna status 500(erro interno)
        }
    }

    // Método para criar um novo serviço
    static async create(req, res) {
        try {
            const id = await ServiceService.createService(req.body); 
            // Chama o service para criar serviço

            res.status(201).json({ message: 'Serviço criado com sucesso.', id }); 
            // Retorna status 201(criado) e o ID
        } catch (error) {
            res.status(400).json({ error: error.message }); 
            // Em caso de erro de validação, retorna status 400
        }
    }

    // Método para atualizar um serviço existente
    static async update(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await ServiceService.updateService(id, req.body); // Chama o service para atualizar
            res.json({ message: 'Serviço atualizado com sucesso.' });
        } catch (error) {
            res.status(400).json({ error: error.message }); 
            // Retorna erro se não encontrar ou problema nos dados
        }
    }

    // Método para deletar um serviço
    static async delete(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await ServiceService.deleteService(id); // Chama o service para deletar
            res.json({ message: 'Serviço deletado com sucesso.' });
        } catch (error) {
            res.status(400).json({ error: error.message }); // Retorna erro se serviço não encontrado
        }
    }
}

module.exports = ServiceController;
// Exporta o Controller para ser usado nas rotas