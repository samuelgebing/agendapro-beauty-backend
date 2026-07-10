const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const ScheduleModel = require("../models/scheduleModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)

class ScheduleService extends BaseService {
    constructor() {
        super(ScheduleModel);
        this.durationMinutesSlots = 15; // Define opções de horário a cada 15 minutos
    }

    // Evita o travamento circular ao carregar o ScheduleService
    get serviceService() {
        if (!this._serviceService) {
            const ServiceService = require("./serviceService");
            // Importa o Model para validar o service_id
            this._serviceService = new ServiceService();
        }
        return this._serviceService;
    }

    // Evita o travamento circular ao carregar o ProfessionalService
    get professionalService() {
        if (!this._professionalService) {
            const ProfessionalService = require("./professionalService");
            // Importa o Model para validar o professional_id
            this._professionalService = new ProfessionalService();
        }
        return this._professionalService;
    }

    // Evita o travamento circular ao carregar o ScheduleService
    get userService() {
        if (!this._serviceService) {
            const UserService = require("./userService");
            // Importa o Model para validar o user_id
            this._userService = new ServiceService();
        }
        return this._userService;
    }

    // Valida os dados do horário antes de criar ou atualizar
    // OBS: sem id
    async validate(schedule) {
        // Verifica se o objeto schedule foi fornecido, caso contrário lança um erro
        if (
            !schedule ||
            Object.keys(schedule).length === 0
        ) {
            throw new this.ValidationError("Agendamento não fornecido.");
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (this.ValidateId.isNull(schedule.professional_id))
            errors.push("Profissional não fornecido.");
        if (this.ValidateId.isNull(schedule.service_id))
            errors.push("Serviço não fornecido.");
        if (this.ValidateId.isNull(schedule.user_id))
            errors.push("Usuário não fornecido.");
        if (!schedule.date)
            errors.push("Data do agendamento não fornecida.");
        if (!schedule.start_date_hour)
            errors.push("Data e hora de início do agendamento não fornecida.");
        if (!schedule.end_date_hour)
            errors.push("Data e hora de término do agendamento não fornecida.");

        if (errors.length > 0) {
            errors[0] = "FALHA NA VALIDAÇÃO DO AGENDAMENTO: " + errors[0];
            throw new this.ValidationError(errors.join(" "));
        }
        // Une em um erro todas as mensagens de validação de campos obrigatórios

        // VALIDAÇÕES DE IDs
        if (this.ValidateId.isInvalid(schedule.professional_id))
            errors.push("Profissional com formato inválido.");
        if (this.ValidateId.isInvalid(schedule.service_id))
            errors.push("Serviço com formato  inválido.");
        if (this.ValidateId.isInvalid(schedule.user_id))
            errors.push("Usuário com formato  inválido.");



        if (this.ValidateTime.isInvalid(schedule.start_date_hour)) {
            errors.push("Data e horário de início com formato inválido.");
        } else {
            // Bloqueia agendamentos retroativos baseados no calendário atual
            const todayStr = new Date().toISOString().split('T')[0];
            if (schedule.start_date_hour < todayStr) {
                errors.push("Não é possível realizar agendamentos em datas retroativas.");
            }
        }

        if (this.ValidateTime.isInvalid(schedule.end_hour))
            errors.push("Data e horário de término com formato inválido.");

        if (errors.length > 0) {
            throw new this.ValidationError("FALHA NA VALIDAÇÃO DO AGENDAMENTO: " + errors.join(" "));
        }

        // Garante que o profissional e o serviço existem no sistema antes de agendar
        await new ProfessionalService().getById(schedule.professional_id, "Profissional");
        await new ServiceService().getById(schedule.service_id, "Serviço");
        await new UserService().getById(schedule.user_id, "Usuário");

        // 4. Validação de Conflito de Horário (Garante a unicidade da agenda)
        const conflict = await this.model.findConflicts(
            schedule.professional_id,
            schedule.start_date_hour,
            schedule.end_date_hour
        );

        if (conflict) {
            throw new this.ConflictError("Profissional já possui agendamento neste horário.");
        }

        if (!schedule.status) {
            schedule.status = 'confirmed';
        }

        // Se todas as validações passarem, apenas continua sem lançar erros
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
    }

    async generatePotentialSlots(service_id, professional_id, date) {
        const service = await this.serviceService.getById(service_id, "Serviço");
        const minDuration = service.min_duration;

        const parsedDate = new Date(date);
        const weekday = parsedDate.getDay(); // Obtém o dia da semana (0-6) 

        // Busca o horário de expediente do profissional para este dia da semana (tabela working_hours)
        const workingHours = await this.professionalService.getWorkingHoursByWeekday(professional_id, weekday);
        if (!workingHours) return []; // Retorna vazio se o profissional não trabalha nesse dia da semana

        // Gera a lista de slots potenciais baseados no expediente e na duração
        const potentialSlots = this._sliceExpedientIntoSlots(workingHours.start_hour, workingHours.end_hour, minDuration);

        return potentialSlots;
    }

    _sliceExpedientIntoSlots(startHour, endHour, durationMinutes) {
        const slots = [];

        // Consome de forma segura os métodos matemáticos herdados do utilitário de tempo
        let currentMinutes = this.ValidateTime.timeToMinutes(startHour);
        const endMinutes = this.ValidateTime.timeToMinutes(endHour);

        // Avança de forma controlada prevenindo loop infinito por NaN ou incremento estático inválido
        while (currentMinutes + durationMinutes <= endMinutes) {
            slots.push({
                start: this.ValidateTime.minutesToHour(currentMinutes),
                end: this.ValidateTime.minutesToHour(currentMinutes + durationMinutes)
            });
            // Adiciona o salto parametrizado (ex: de 15 em 15 minutos)
            currentMinutes += this.durationMinutesSlots;
        }
        return slots;
    }

    _getDayAgenda(slots, schedules) {
        // Filtra o array mantendo apenas os slots que NÃO têm sobreposição
        const availableSlots = slots.filter(slot => {
            const slotStart = slot.start;
            const slotEnd = slot.end;

            
            // .some() retorna true se encontrar QUALQUER agendamento que sobreponha este slot
            const isOccupied = schedules.some(sched => {
                // Transforma para exibir ao usuário
                // 2024-06-01T13:00:00.000Z --> 2024-06-01 10:00:00
                sched.start_date_hour = this.ValidateTime.convert(new Date(sched.start_date_hour), 'datetime');
                sched.end_date_hour = this.ValidateTime.convert(new Date(sched.end_date_hour), 'datetime');
                // Pega apenas o horário
                const schedStart = this.ValidateTime.convert(sched.start_date_hour, 'hourShort');
                const schedEnd = this.ValidateTime.convert(sched.end_date_hour, 'hourShort');

                // Transforma o "created_at"
                sched.created_at = this.ValidateTime.convert(new Date(sched.created_at), 'datetime');

                // Lógica de colisão/sobreposição de horários
                return slotStart < schedEnd && slotEnd > schedStart;
            });

            // Se NÃO estiver ocupado, mantém o slot na lista
            return !isOccupied;
        });

        const agenda = { availableSlots, schedules };

        return agenda;
    }


    async getAgenda(service_id, professional_id = null, date = null) {
        const service = await this.serviceService.getById(service_id, "Serviço");
        if (!this.ValidateId.isNull(professional_id)) {
            this.ValidateId.isInvalid(professional_id, "Profissional");
            // validar data - UTILS
            // é opcional

            if (date) {
                const professionalSchedules = await this.professionalService.findAllSchedules(professional_id, date);
            } else {
                const professionalSchedules = await this.professionalService.findAllSchedules(professional_id);
            }
            return {
                service,
                professionalSchedules
            };
        } else {
            // Se professional_id não for fornecido, apenas retorna o serviço
            return { service };
        }

        this.ValidateId.primaryKey(professional_id, "Profissional"); // Valida o ID antes de buscar
        const schedules = await this.model.findAllSchedules(professional_id);
        return schedules;
    }
}

module.exports = ScheduleService;
// Exporta a classe para ser utilizada pelos controllers
