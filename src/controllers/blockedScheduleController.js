// SPRINT 2: CRUD para horários de profissionais
const BlockedScheduleService = require('../services/blockedScheduleService');
// Importa o serviço que contém a lógica de negócio para manipular horários de profissionais

class BlockedScheduleController {
    // Método para listar todos os horários de profissionais
    static async getAll(req, res) {
        try {
            //FAZER
            // Se a URL for /schedules, professional_id será undefined (Falso no IF do Schedule)
            // Se for /schedules?professional_id=1, professional_id será '1' (Verdadeiro no IF do Schedule)
            const { professional_id } = req.query;

            const blockedSchedules = await BlockedScheduleService.getAllBlockedSchedules(professional_id);

            res.json(blockedSchedules); // Retorna a lista em formato JSON
        } catch (error) {
            if(!error.statusCode) error.statusCode = 500; 
            // Se não houver statusCode, define como 500 (erro interno)
            res.status(error.statusCode).json({ error: error.message }); // Em caso de erro, retorna status 500(erro interno)
        }
    }

    // Método para criar um novo horário
    static async create(req, res) {
        try {
            const id = await BlockedScheduleService.createBlockedSchedule(req.body); 
            // Chama o service para criar horário bloqueado

            res.status(201).json({ message: 'Bloqueio de horário criado com sucesso.', id }); 
            // Retorna status 201(criado) e o ID
        } catch (error) {
            if(!error.statusCode) error.statusCode = 500; 
            // Se não houver statusCode, define como 500 (erro interno do servidor)
            res.status(error.statusCode).json({ error: error.message }); 
            // Em caso de erro interno do servidor, retorna status 500
        }
    }

    // Método para atualizar um horário existente
    static async update(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await BlockedScheduleService.updateBlockedSchedule(id, req.body); // Chama o service para atualizar
            res.json({ message: 'Bloqueio de horário atualizado com sucesso.' });
        } catch (error) {
            if(!error.statusCode) error.statusCode = 400; 
            // Se não houver statusCode, define como 400 (erro de validação)
            res.status(error.statusCode).json({ error: error.message }); 
            // Retorna erro se não encontrar ou problema nos dados
        }
    }

    // Método para deletar um horário bloqueado
    static async delete(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await BlockedScheduleService.deleteBlockedSchedule(id); // Chama o service para deletar
            res.json({ message: 'Bloqueio de horário deletado com sucesso.' });
        } catch (error) {
            if(!error.statusCode) error.statusCode = 400; 
            // Se não houver statusCode, define como 400 (erro de validação)
            res.status(error.statusCode).json({ error: error.message }); // Retorna erro se horário não encontrado
        }
    }
}

module.exports = BlockedScheduleController;
// Exporta o Controller para ser usado nas rotas