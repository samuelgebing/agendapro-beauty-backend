const BaseModel = require("./baseModel");
// Importa a classe base para modelos
/*
const WorkingHoursModel = require('./workingHoursModel');
const BlockedHoursModel = require('./blockedHoursModel');
*/

class ScheduleModel extends BaseModel {
    constructor() {
        super('schedules', ['service_id', 'professional_id', 'user_id', 'start_date_hour', 'end_date_hour', 'status']);
        // professional_id deve ser verificado no service
    }

    findByServiceId = async (serviceId) => {
        const [rows] = await db.execute('SELECT * FROM schedules WHERE service_id = ?', 
            [serviceId]);
        return rows;
    }

    /**
     * Busca agendamentos ativos de um profissional em uma data específica
     * Evita que horários sejam sobrepostos na agenda
     */
    async findConflicts(professionalId, startDateHour, endDateHour) {
        const query = `
            SELECT * FROM ${this.tableName} 
            WHERE professional_id = ? 
              AND (
                (start_date_hour <= ? AND end_date_hour > ?) OR
                (start_date_hour < ? AND end_date_hour >= ?) OR
                (? <= start_date_hour AND ? > start_date_hour)
              )
            LIMIT 1
        `;
        const [rows] = await this.db.execute(query, [
            professionalId,  
            startDateHour, startDateHour,
            endDateHour, endDateHour,
            startDateHour, endDateHour
        ]);
        return rows.length > 0 ? rows[0] : null;
    }

    /*
    findWorkingAndBlockedSchedules = async (serviceId, professionalId, date) => {
        // 1. Coleta os dados de configuração e bloqueios em paralelo através dos sub-models
        const [workingHours, blockedHours] = await Promise.all([
            WorkingHoursModel.findByProfessionalId(professionalId),
            BlockedHoursModel.findByProfessionalIdAndDate(professionalId, date)
        ]);

        // Se o profissional não tem horário de trabalho cadastrado, retorna vazio
        if (!workingHours || workingHours.length === 0) return [];

        // 2. Descobre o dia da semana da data enviada (0 = Domingo, 1 = Segunda, etc.)
        const weekday = new Date(date).getDay();

        // Filtra a jornada de trabalho correspondente ao dia da semana da requisição
        const todaysWork = workingHours.filter(wh => wh.weekday === weekday);
        if (todaysWork.length === 0) return [];

        const availableSlots = [];

        // 3. Algoritmo de composição e fatiamento de horários (Exemplo base)
        for (const shift of todaysWork) {
            let currentPointer = this._timeToMinutes(shift.start_hour);
            const endLimit = this._timeToMinutes(shift.end_hour);

            // Avança no tempo gerando slots baseados na duração mínima do serviço
            while (currentPointer + minDuration <= endLimit) {
                const slotStart = currentPointer;
                const slotEnd = currentPointer + minDuration;

                // Valida se o slot gerado conflita com algum horário bloqueado do banco
                const isBlocked = blockedHours.some(block => {
                    const blockStart = this._timeToMinutes(block.start.split(' ')[1] || block.start);
                    const blockEnd = this._timeToMinutes(block.end.split(' ')[1] || block.end);
                    // Checa intersecção de horários
                    return (slotStart < blockEnd && slotEnd > blockStart);
                });

                if (!isBlocked) {
                    availableSlots.push({
                        start: this._minutesToTime(slotStart),
                        end: this._minutesToTime(slotEnd)
                    });
                }

                // Salto do ponteiro (pode ser incrementado pela duração do serviço ou fixo em 30 min)
                currentPointer += minDuration; 
            }
        }

        return availableSlots;




        const [rows] = await db.execute(
            'SELECT * FROM schedules WHERE service_id = ? AND professional_id = ? AND date = ? AND available = 1', 
            [serviceId, professionalId, date]);
        return rows;
    }
    */
}

module.exports = ScheduleModel;
// Exporta a classe ScheduleModel para ser usada nos services
