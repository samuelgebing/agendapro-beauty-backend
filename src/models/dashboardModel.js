const db = require('../config/database');
// Importa a conexão pool com o banco de dados

const BaseModel = require('./baseModel');
// Importa a classe base para modelos

class DashboardModel extends BaseModel {
    constructor() {
        super('schedules', ['professional_id', 'service_id', 'status_id', 'start_date_hour', 'end_date_hour']);
    }

    async countAllSchedules() {
        const [rows] = await db.execute(
            `SELECT count(*) as total_agendamentos FROM schedules`
        );
        return rows[0]?.total_agendamentos || 0; // Retorna diretamente o número
    }

    async countSchedulesByProfessional(professionalId = null) {
        if (!professionalId) {
            const [rows] = await db.execute(
                `SELECT professional_id, count(*) as quantidade FROM schedules
                GROUP BY professional_id
                ORDER BY quantidade DESC`
            );
            return rows; // Retorna todos os profissionais com suas contagens
        } else {
            const [rows] = await db.execute(
                `SELECT professional_id, count(*) as quantidade FROM schedules 
                WHERE professional_id = ?
                GROUP BY professional_id`,
                [professionalId]
            );
            return rows[0]?.quantidade || 0; // Retorna diretamente o número
        }
    }

    async countSchedulesByStatus(statusId = null) {
        if (!statusId) {
            const [rows] = await db.execute(
                `SELECT status_id, count(*) as quantidade FROM schedules
                GROUP BY status_id`
            );
            return rows; // Retorna a lista completa de status com suas contagens

        } else {
            const [rows] = await db.execute(
                `SELECT status_id, count(*) as quantidade FROM schedules 
                WHERE status_id = ?
                GROUP BY status_id`,
                [statusId]
            );
            return rows[0]?.quantidade || 0; // Retorna diretamente o número
        }
    }

    async countSchedulesByClient(clientId = null) {
        if (!clientId) {
            const [rows] = await db.execute(
                `SELECT user_id, count(*) as quantidade FROM schedules
                GROUP BY user_id
                ORDER BY quantidade DESC`
            );
            return rows; // Retorna todos os clientes com suas contagens
        } else {
            const [rows] = await db.execute(
                `SELECT user_id, count(*) as quantidade FROM schedules 
                 WHERE user_id = ?
                 GROUP BY user_id`,
                [clientId]
            );
            return rows[0]?.quantidade || 0; // Retorna diretamente o número
        }
    }

    async countSchedulesByDateRange(startDate, endDate) {
        let query = `SELECT DATE_FORMAT(start_date_hour, '%Y-%m') AS periodo, COUNT(*) AS quantidade 
            FROM schedules
            WHERE start_date_hour BETWEEN ? AND ?
                GROUP BY periodo
                ORDER BY periodo DESC`

        console.log(query);

        const [rows] = await db.execute(query, [startDate, endDate]);            
        console.log('start:', startDate);
        console.log('end:', endDate);
        return rows; // Retorna diretamente o número
    }

    async countSchedulesByService(serviceId = null) {
        if (!serviceId) {
            const [rows] = await db.execute(
                `SELECT service_id, count(*) as quantidade FROM schedules
                GROUP BY service_id
                ORDER BY quantidade DESC`
            );
            return rows; // Retorna todos os serviços com suas contagens
        } else {
            const [rows] = await db.execute(
                `SELECT service_id, count(*) as quantidade FROM schedules 
                 WHERE service_id = ?
                 GROUP BY service_id`,
                [serviceId]
            );
            return rows[0]?.quantidade || 0; // Retorna diretamente o número
        }
    }
}

module.exports = new DashboardModel();
// Exporta a classe DashboardModel para ser usada nos services
