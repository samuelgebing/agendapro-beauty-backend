const BlockedScheduleModel = require("../models/scheduleModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)
const ProfessionalModel = require("../models/professionalModel");
// Importa o Model para validar o professional_id
const ValidateId = require("../utils/validateId");
// Importa a classe utilitária que valida o formato de IDs

class BlockedScheduleService {
    // Valida os dados do horário antes de criar ou atualizar
    // OBS: sem id
    static async validateBlockedSchedule(blockedSchedule) {
        // Verifica se o objeto blockedSchedule foi fornecido, caso contrário lança um erro
        if (
            !blockedSchedule || 
            Object.keys(blockedSchedule).length === 0
        ) {
            const error = new Error("Bloqueio de horário não fornecido.");
            error.statusCode = 400;
            throw error;
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (ValidateId.isNull(blockedSchedule.professional_id)) 
            errors.push("Profissional não fornecido.");
        if (!blockedSchedule.start) errors.push("Data de início do bloqueio não fornecida.");
        if (!blockedSchedule.end) errors.push("Data de término do bloqueio não fornecida.");
        if (!blockedSchedule.reason) errors.push("Motivo não fornecido.");
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // VALIDAÇÕES DE PROFESSIONAL_ID
        if (ValidateId.isInvalid(blockedSchedule.professional_id)) 
            errors.push("Profissional com formato inválido.");

        // FAZER: 
        // VALIDAÇÕES DE DATA DE INÍCIO E TÉRMINO
        if (typeof blockedSchedule.start !== "string") 
            errors.push("Data de início com formato inválido.");
        if (typeof blockedSchedule.end !== "string") 
            errors.push("Data de término com formato inválido.");

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingProfessionalId = await ProfessionalModel.findById(blockedSchedule.professional_id);
        if (!existingProfessionalId || existingProfessionalId == ""){
            const error = new Error("Profissional não encontrado.");
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error;
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    // Busca todos os horários cadastrados
    static async getAllBlockedSchedules() {
        return await BlockedScheduleModel.findAll();
    }

    // Cria um novo horário após validações
    static async createSchedule(blockedSchedule) {
        await this.validateSchedule(blockedSchedule); // Chama a função de validação
        return await BlockedScheduleModel.create(blockedSchedule); // Cria o novo horário
    }

    // Atualiza informações de um horário existente após validações
    static async updateSchedule(id, blockedSchedule) {
        ValidateId.primaryKey(id,'Bloqueio de Horário'); // Chama a função de validação do id
        await this.validateSchedule(blockedSchedule); // Chama a função de validação

        const updatedRows = await BlockedScheduleModel.update(id, blockedSchedule);
        if (updatedRows === 0) {
            const error = new Error("Bloqueio de horário não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }

        return updatedRows;
    }

    // Deleta um horário pelo ID
    static async deleteSchedule(id) {
        ValidateId.primaryKey(id,'Bloqueio de Horário'); // Chama a função de validação do id
        const deletedRows = await BlockedScheduleModel.delete(id);
        if (deletedRows === 0) {
            const error = new Error("Bloqueio de horário não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }

        return deletedRows;
    }
}

module.exports = ScheduleService;
// Exporta a classe para ser utilizada pelos controllers
