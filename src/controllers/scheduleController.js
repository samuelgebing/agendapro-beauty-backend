// SPRINT 2: CRUD para horários de profissionais
const ScheduleService = require('../services/scheduleService');
// Importa o serviço que contém a lógica de negócio para manipular horários de profissionais

class ScheduleController {
    // Método para listar todos os horários de profissionais
    static async getAll(req, res) {
        try {
            //FAZER
            // Se a URL for /schedules, professional_id será undefined (Falso no IF do Schedule)
            // Se for /schedules?professional_id=1, professional_id será '1' (Verdadeiro no IF do Schedule)
            const { professional_id } = req.query;

            const schedules = await ScheduleService.getAllSchedules(professional_id);

            res.json(schedules); // Retorna a lista em formato JSON
        } catch (error) {
            if(!error.statusCode) error.statusCode = 500; 
            // Se não houver statusCode, define como 500 (erro interno)
            res.status(error.statusCode).json({ error: error.message }); // Em caso de erro, retorna status 500(erro interno)
        }
    }

    // Método para criar um novo horário
    static async create(req, res) {
        try {
            const id = await ScheduleService.createSchedule(req.body); 
            // Chama o service para criar horário

            res.status(201).json({ message: 'Horário criado com sucesso.', id }); 
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
            await ScheduleService.updateSchedule(id, req.body); // Chama o service para atualizar
            res.json({ message: 'Horário atualizado com sucesso.' });
        } catch (error) {
            if(!error.statusCode) error.statusCode = 400; 
            // Se não houver statusCode, define como 400 (erro de validação)
            res.status(error.statusCode).json({ error: error.message }); 
            // Retorna erro se não encontrar ou problema nos dados
        }
    }

    // Método para deletar um horário
    static async delete(req, res) {
        try {
            const id = req.params.id; // Pega o ID da URL
            await ScheduleService.deleteSchedule(id); // Chama o service para deletar
            res.json({ message: 'Horário deletado com sucesso.' });
        } catch (error) {
            if(!error.statusCode) error.statusCode = 400; 
            // Se não houver statusCode, define como 400 (erro de validação)
            res.status(error.statusCode).json({ error: error.message }); // Retorna erro se horário não encontrado
        }
    }
}

module.exports = ScheduleController;
// Exporta o Controller para ser usado nas rotas