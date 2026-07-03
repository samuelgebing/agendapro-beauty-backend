const ScheduleModel = require("../models/scheduleModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)
const ProfessionalModel = require("../models/professionalModel");
// Importa o Model para validar o professional_id
const ValidateId = require("../utils/validateId");
// Importa a classe utilitária que valida o formato de IDs

class ScheduleService {
    // Valida os dados do horário antes de criar ou atualizar
    // OBS: sem id
    static async validateSchedule(schedule) {
        // Verifica se o objeto schedule foi fornecido, caso contrário lança um erro
        if (
            !schedule || 
            Object.keys(schedule).length === 0
        ) {
            const error = new Error("Horário não fornecido.");
            error.statusCode = 400;
            throw error;
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (ValidateId.isNull(schedule.professional_id)) 
            errors.push("Profissional não fornecido.");
        if (!schedule.weekday) errors.push("Dia da semana não fornecido.");
        if (!schedule.start_hour) errors.push("Hora de início não fornecida.");
        if (!schedule.end_hour) errors.push("Hora de término não fornecida.");
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // VALIDAÇÕES DE DIA DA SEMANA
        if (![0,1,2,3,4,5,6].includes(Number(schedule.weekday))) 
            errors.push("Dia da semana com formato inválido.");

        // VALIDAÇÕES DE PROFESSIONAL_ID
        if (ValidateId.isInvalid(schedule.professional_id)) 
            errors.push("Profissional com formato inválido.");

        // FAZER: 
        // VALIDAÇÕES DE HORA DE INÍCIO E TÉRMINO
        if (typeof schedule.start_hour !== "string") 
            errors.push("Hora de início com formato inválido.");
        if (typeof schedule.end_hour !== "string") 
            errors.push("Hora de término com formato inválido.");

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingProfessionalId = await ProfessionalModel.findById(schedule.professional_id);
        if (!existingProfessionalId || existingProfessionalId == ""){
            const error = new Error("Profissional não encontrado.");
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error;
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
    }

    // Busca todos os horários cadastrados
    static async getAllSchedules() {
        return await ScheduleModel.findAll();
    }

    // Cria um novo horário após validações
    static async createSchedule(schedule) {
        await this.validateSchedule(schedule); // Chama a função de validação
        return await ScheduleModel.create(schedule); // Cria o novo horário
    }

    // Atualiza informações de um horário existente após validações
    static async updateSchedule(id, schedule) {
        ValidateId.primaryKey(id,'Horário de Profissional'); // Chama a função de validação do id
        await this.validateSchedule(schedule); // Chama a função de validação

        const updatedRows = await ScheduleModel.update(id, schedule);
        if (updatedRows === 0) {
            const error = new Error("Horário não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }

        return updatedRows;
    }

    // Deleta um horário pelo ID
    static async deleteSchedule(id) {
        ValidateId.primaryKey(id,'Horário de Profissional'); // Chama a função de validação do id
        const deletedRows = await ScheduleModel.delete(id);
        if (deletedRows === 0) {
            const error = new Error("Horário não encontrado."); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }

        return deletedRows;
    }
}

module.exports = ScheduleService;
// Exporta a classe para ser utilizada pelos controllers
