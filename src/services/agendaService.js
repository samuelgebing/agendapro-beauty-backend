const ScheduleService = require("./scheduleService");
// Importa a classe base com os métodos CRUD genéricos
// A partir da importação da ScheduleService
const ScheduleModel = require("../models/scheduleModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)

// IMPORTAÇÃO DOS SUB-SERVIÇOS NECESSÁRIOS
const WorkingHoursService = require("./workingHoursService"); // Ajuste os caminhos se necessário
const BlockedHoursService = require("./blockedHoursService");
const ServiceService = require("./serviceService");

class AgendaService extends ScheduleService {
    constructor() {
        super(ScheduleModel);

        this.workingHoursService = new WorkingHoursService();
        this.blockedHoursService = new BlockedHoursService();
        // this.serviceService = new ServiceService();
    }

    /**
     * Valida os filtros recebidos pela URL 
     * EX: (?professional_id=1)
     */
    async validateFilters(filters) {
        // Se o horário passou o filtro professional_id na URL
        if (filters && filters.professional_id) {
            this.ValidateId.primaryKey(filters.professional_id, "Profissional");
        }
        if (filters && filters.date) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(filters.date)) {
                throw new this.ValidationError("Formato de data inválido, use YYYY-MM-DD.");
            }
        }

        // Adicionar validações para outros filtros da URL aqui...

        return filters;
    }

    // Voltado para clientes --> mostra apenas horários disponíveis
    async getAgenda(filters = {}) {
        const { service_id, professional_id, date } = filters;

        // PARÂMETROS OBRIGATÓRIOS
        this.ValidateId.primaryKey(service_id, "Serviço");
        this.ValidateId.primaryKey(professional_id, "Profissional");

        // DADOS DO SERVIÇO
        const service = await this.serviceService.getById(service_id, "Serviço");
        const minDuration = service.min_duration;

        // DADOS DO PROFISSIONAL
        // Busca o horário de expediente do profissional para este dia da semana (tabela working_hours)
        // FAZER: permitir mais de um horário no dia (manhã e tarde)
        
        // FAZER: Validar data
        // Declaração das variáveis fora do bloco condicional para garantir acesso global no método
        let workingHours = [];
        let blockedHours = [];

        if (!this.ValidateTime.isNull(date)) {
            this.ValidateTime.isInvalid(date);
            
            const parsedDate = new Date(`${date}T00:00:00`);
            const weekday = parsedDate.getDay(); 
            
            // 1. Busca horários de trabalho do dia
            workingHours = await this.workingHoursService.getAll({
                'professional_id': professional_id, 
                'weekday': weekday
            });
            
            if (!workingHours || (Array.isArray(workingHours) && workingHours.length === 0)) {
                return { availableSlots: [], schedules: [] };
            }

            // 2. CORREÇÃO: Busca os bloqueios do dia inteiro direto no banco de dados primeiro
            const rawBlockedHours = await this.blockedHoursService.getByProfessionalAndDate(
                professional_id,
                `${date} 00:00:00`,
                `${date} 23:59:59`
            );

            // 3. Formata os registros retornados usando a sua função auxiliar de formatação
            blockedHours = this.blockedHoursService._validateDates(rawBlockedHours);
        } else {
            // Se não houver data, busca o agendamento de todo o expediente
            workingHours = await this.workingHoursService.getAll({ 'professional_id': professional_id });
            
            if (!workingHours || (Array.isArray(workingHours) && workingHours.length === 0)) 
                return { availableSlots: [], schedules: [] };

            blockedHours = await this.blockedHoursService.getByProfessionalId(professional_id);
        }

        // SUPORTE A MÚLTIPLOS TURNOS (Gera os slots potenciais do dia)
        const potentialSlots = [];
        const workingHoursList = Array.isArray(workingHours) ? workingHours : [workingHours];

        for (const shift of workingHoursList) {
            const shiftSlots = this._sliceExpedientIntoSlots(shift.start_hour, shift.end_hour, minDuration);
            potentialSlots.push(...shiftSlots);
        }

        // 5. CONSULTA HORÁRIOS JÁ AGENDADOS (Para descobrir o que está ocupado)
        const searchDate = !this.ValidateTime.isNull(date) ? date : this.ValidateTime.convert(new Date(), 'date');
        const {professionalSchedules} = await this.getProfessionalAgenda( // scheduleService.getProfessionalAgenda()
            professional_id,
            searchDate
        );

        // 6. RETORNA APENAS OS HORÁRIOS LIVRES (Chama seu validador de colisão)
        const finalAgenda = this._getDayAgenda(potentialSlots, professionalSchedules, blockedHours);

        return finalAgenda;
    }

    // TESTAR
    async getClientAgenda(client_id, filters = {}) {
        this.ValidateId.primaryKey(client_id, "Cliente");
        const { service_id, professional_id, date } = filters;

        // Parâmetros opcionais (cliente pode querer ver todos os agendamentos de todos os serviços)
        if (service_id) this.ValidateId.primaryKey(service_id, "Serviço");
        if (professional_id) this.ValidateId.primaryKey(professional_id, "Profissional"); 

        const user_id = { client_id }; // Adapta para os padrões do banco

        let clientSchedules;
        if (date) {
            this.ValidateTime.isInvalid(date);
            // Garante que a string final seja exatamente "2024-06-04"
            const formattedDate = date.trim(); 
        
            clientSchedules = await this.model.findConflicts(
                user_id, 
                `${formattedDate} 00:00:00`,
                `${formattedDate} 23:59:59`
            );
        } else {
            clientSchedules = await this.model.findAllSchedules(user_id);
        }

    // IMPRIME O RETORNO BRUTO DO BANCO DE DADOS
    console.log("Retorno Bruto do Banco:", clientSchedules);
    console.log("=============================");

        const rawList = Array.isArray(clientSchedules) 
            ? clientSchedules 
            : (clientSchedules?.rows || clientSchedules?.data || []);

        const formattedList = rawList.map(item => {
            // Garante a leitura de dados puros caso venha encapsulado pelo Sequelize
            const sched = typeof item.toJSON === 'function' ? item.toJSON() : (item.dataValues || item);
            
            return {
                ...sched,
                // Transforma: "2024-06-04T17:00:00.000Z" --> "2024-06-04 14:00:00"
                start_date_hour: this.ValidateTime.convert(new Date(sched.start_date_hour), 'datetime'),
                end_date_hour: this.ValidateTime.convert(new Date(sched.end_date_hour), 'datetime'),
                created_at: sched.created_at ? this.ValidateTime.convert(new Date(sched.created_at), 'datetime') : null
            };
        });

        console.log("Retorno Formatado Local:", formattedList);
        console.log("=============================");

        return {
            // Retorna a lista com as strings já convertidas
            clientSchedules: formattedList
        };

        this.ValidateId.primaryKey(user_id, "Cliente"); // Valida o ID antes de buscar
        const schedules = await this.model.findAllSchedules(user_id);
        return schedules;
    }
    
    // TESTAR
    // Voltado para o profissional --> mostra detalhes dos agendamentos
    async getProfessionalAgenda(professional_id, date = null) {
        this.ValidateId.isInvalid(professional_id, "Profissional");
        // validar data - UTILS
        // é opcional

        let professionalSchedules;
        if (date) {
            this.ValidateTime.isInvalid(date);
            // Garante que a string final seja exatamente "2024-06-04"
            const formattedDate = date.trim(); 
        
        // IMPRIME OS PARÂMETROS EXATOS QUE ESTÃO INDO PARA A QUERY
        console.log("=== QUERY DE AGENDAMENTOS ===");
        console.log("Profissional ID enviado:", professional_id);
        console.log("Data Início:", `${formattedDate} 00:00:00`);
        console.log("Data Fim:", `${formattedDate} 23:59:00`);

            professionalSchedules = await this.model.findConflicts(
                professional_id, 
                `${formattedDate} 00:00:00`,
                `${formattedDate} 23:59:59`
            );
        } else {
            professionalSchedules = await this.model.findAllSchedules(professional_id);
        }

    // IMPRIME O RETORNO BRUTO DO BANCO DE DADOS
    console.log("Retorno Bruto do Banco:", professionalSchedules);
    console.log("=============================");

        const rawList = Array.isArray(professionalSchedules) 
            ? professionalSchedules 
            : (professionalSchedules?.rows || professionalSchedules?.data || []);

        const formattedList = rawList.map(item => {
            // Garante a leitura de dados puros caso venha encapsulado pelo Sequelize
            const sched = typeof item.toJSON === 'function' ? item.toJSON() : (item.dataValues || item);
            
            return {
                ...sched,
                // Transforma: "2024-06-04T17:00:00.000Z" --> "2024-06-04 14:00:00"
                start_date_hour: this.ValidateTime.convert(new Date(sched.start_date_hour), 'datetime'),
                end_date_hour: this.ValidateTime.convert(new Date(sched.end_date_hour), 'datetime'),
                created_at: sched.created_at ? this.ValidateTime.convert(new Date(sched.created_at), 'datetime') : null
            };
        });

        console.log("Retorno Formatado Local:", formattedList);
        console.log("=============================");

        return {
            // Retorna a lista com as strings já convertidas
            professionalSchedules: formattedList
        };

        this.ValidateId.primaryKey(professional_id, "Profissional"); // Valida o ID antes de buscar
        const schedules = await this.model.findAllSchedules(professional_id);
        return schedules;
    }

    _sliceExpedientIntoSlots(startHour, endHour, durationMinutes) {
        const slots = [];

        // Consome de forma segura os métodos matemáticos herdados do utilitário de tempo
        let currentMinutes = this.ValidateTime.timeToMinutes(startHour);
        const endMinutes = this.ValidateTime.timeToMinutes(endHour);
    
        // SEGURANÇA: Se o salto parametrizado não existir, usa a duração do próprio serviço.
        // Garante que o incremento nunca seja zero ou menor, evitando loops infinitos.
        const step = this.durationMinutesSlots || durationMinutes;
        if (!step || step <= 0) return slots;

        // Avança de forma controlada prevenindo loop infinito por NaN ou incremento estático inválido
        while (currentMinutes + durationMinutes <= endMinutes) {
            slots.push({
                start: this.ValidateTime.minutesToHour(currentMinutes),
                end: this.ValidateTime.minutesToHour(currentMinutes + durationMinutes)
            });
            // Adiciona o salto parametrizado (ex: de 15 em 15 minutos)
            currentMinutes += step;
        }
        return slots;
    }

    _getDayAgenda(slots, schedules, blockedHours = []) {
        // 1. EXTRAÇÃO SEGURA DAS LISTAS
        const schedulesList = Array.isArray(schedules) 
            ? schedules 
            : (schedules?.rows || schedules?.data || []);

        const blocksList = Array.isArray(blockedHours) ? blockedHours : [];

        // 2. NORMALIZAÇÃO DOS AGENDAMENTOS (CORRIGIDO: Executa o convert apenas uma vez)
        const normalizedSchedules = schedulesList.map(item => {
            const sched = typeof item.toJSON === 'function' ? item.toJSON() : (item.dataValues || item);
            
            const startDt = new Date(sched.start_date_hour);
            const endDt = new Date(sched.end_date_hour);
            
            // Converte o objeto Date do banco diretamente para a string de hora curta (ex: "14:00")
            const startHourShort = this.ValidateTime.convert(startDt, 'hourShort');
            const endHourShort = this.ValidateTime.convert(endDt, 'hourShort');

            // Formata as strings completas no fuso horário do Brasil para exibição final ao usuário
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            const localStartStr = startDt.toLocaleString('pt-BR', options).replace(',', '');
            const localEndStr = endDt.toLocaleString('pt-BR', options).replace(',', '');
                    
            return {
                schedStart: startHourShort,
                schedEnd: endHourShort
            };
        });

        // 3. NORMALIZAÇÃO DOS BLOQUEIOS 
        const normalizedBlocks = blocksList.map(item => {
            const block = typeof item.toJSON === 'function' ? item.toJSON() : (item.dataValues || item);

            const rawStart = block.start_date_hour || block.start || block.start_hour;
            const rawEnd = block.end_date_hour || block.end || block.end_hour;

            return {
                blockStart: this.ValidateTime.convert(new Date(rawStart), 'hourShort'),
                blockEnd: this.ValidateTime.convert(new Date(rawEnd), 'hourShort')
            };
        });

        // 4. LOG DE VALIDAÇÃO (Para conferir o alinhamento perfeito das strings textuais)
        console.log("Slots Gerados:", slots);
        console.log("Agendamentos Normalizados (Corrigido):", normalizedSchedules);
        console.log("Bloqueios Normalizados:", normalizedBlocks);

        // 5. FILTRAGEM DE SLOTS LIVRES (Regra de Colisão Unificada)
        const availableSlots = slots.filter(slot => {
            const slotStart = slot.start; 
            const slotEnd = slot.end;     

            const isOccupied = normalizedSchedules.some(sched => {
                return slotStart < sched.schedEnd && slotEnd > sched.schedStart;
            });

            const isBlocked = normalizedBlocks.some(block => {
                return slotStart < block.blockEnd && slotEnd > block.blockStart;
            });

            return !isOccupied && !isBlocked;
        });

        return { 
            availableSlots,
            schedules: schedulesList,
            blockedHours: blocksList
        };
    }

}

module.exports = AgendaService;
// Exporta a classe para ser utilizada pelos controllers
