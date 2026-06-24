// SPRINT 2: HTTP - Retorno de erros com status HTTP corretos (400, 404, 500)

const ProfessionalService = require('../services/professionalService');
// Importa o serviço que contém a lógica de negócio para manipular profissionais

class ProfessionalController {
    // Método para listar todos os profissionais
    static async getAll(req, res) {
        try {
            const professionals = await ProfessionalService.getAllProfessionals(); 
            // Chama o service para buscar profissionais

            res.json(professionals); // Retorna a lista em formato JSON
        } catch (error) {
            if(!error.statusCode) error.statusCode = 500; 
            // Se não houver statusCode, define como 500 (erro interno)
            res.status(error.statusCode).json({ error: error.message }); 
        }
    }

    // Método para criar um novo profissional
    static async create(req, res) {
        try {
            const id = await ProfessionalService.createProfessional(req.body); 
            // Chama o service para criar profissional

            res.status(201).json({ message: 'Profissional criado com sucesso.', id }); 
            // Retorna status 201(criado) e o ID
        } catch (error) {
            if(!error.statusCode) error.statusCode = 400; 
            // Se não houver statusCode, define como 400 (erro de validação)
            res.status(error.statusCode).json({ error: error.message }); 
        }
    }

    // Método para atualizar um profissional existente
    static async update(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await ProfessionalService.updateProfessional(id, req.body); // Chama o service para atualizar
            res.json({ message: 'Profissional atualizado com sucesso.' });
        } catch (error) {
            if(!error.statusCode) error.statusCode = 404; 
            // Se não houver statusCode, define como 404 (não encontrado)
            res.status(error.statusCode).json({ error: error.message }); 
        }
    }

    // Método para deletar um profissional
    static async delete(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await ProfessionalService.deleteProfessional(id); // Chama o service para deletar
            res.json({ message: 'Profissional deletado com sucesso.' });
        } catch (error) {
            if(!error.statusCode) error.statusCode = 404; 
            // Se não houver statusCode, define como 404 (não encontrado)
            res.status(error.statusCode).json({ error: error.message }); 
        }
    }
}

module.exports = ProfessionalController;
// Exporta o Controller para ser usado nas rotas