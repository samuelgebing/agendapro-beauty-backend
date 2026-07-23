const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const ScheduleModel = require("../models/scheduleModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)

class ScheduleService extends BaseService {
    constructor() {
        super(ScheduleModel);
        this.durationMinutesSlots = 15; // Define opções de horário a cada 15 minutos

        const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
        this.timeBeforeCancellation = TWO_HOURS_IN_MS; 
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
        if (!this._userService) {
            const UserService = require("./userService");
            // Importa o Model para validar o user_id
            this._userService = new UserService();
        }
        return this._userService;
    }

    // Valida os dados do horário antes de criar ou atualizar
    // OBS: sem id
    validate = async (schedule) => {
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

        if (this.ValidateTime.isInvalid(schedule.end_date_hour))
            errors.push("Data e horário de término com formato inválido.");

        if (errors.length > 0) {
            throw new this.ValidationError("FALHA NA VALIDAÇÃO DO AGENDAMENTO: " + errors.join(" "));
        }

        // Garante que o profissional e o serviço existem no sistema antes de agendar
        await this.professionalService.getById(schedule.professional_id, "Profissional");
        await this.serviceService.getById(schedule.service_id, "Serviço");
        await this.userService.getById(schedule.user_id, "Usuário");

        // 4. Validação de Conflito de Horário (Garante a unicidade da agenda)
        const conflict = await this.model.findConflicts(
            schedule.professional_id,
            schedule.start_date_hour,
            schedule.end_date_hour
        );

        if (conflict.length > 0) {
            throw new this.ConflictError("Profissional já possui agendamento neste horário.");
        }

        // FAZER: Validar com o banco
        if (!schedule.status_id) {
            schedule.status_id = 1;
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

        return filters;
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

            
            const schedulesList = Array.isArray(schedules) 
                ? schedules 
                : (schedules?.rows || schedules?.data || []);            
                
            // .some() retorna true se encontrar QUALQUER agendamento que sobreponha este slot
            const isOccupied = schedulesList.some(sched => {
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


    async getProfessionalAgenda(professional_id, date = null) {
        this.ValidateId.isInvalid(professional_id, "Profissional");
        // validar data - UTILS
        // é opcional

        let professionalSchedules;
        if (date) {
            this.ValidateTime.isInvalid(date);
            date = this.ValidateTime.convert(date,'date');
            professionalSchedules = await this.model.findConflicts(
                professional_id, 
                `${date} 00:00`,
                `${date} 23:59`
            );
        } else {
            professionalSchedules = await this.model.findOneBy(professional_id);
        }
        return {
            professionalSchedules
        };

        this.ValidateId.primaryKey(professional_id, "Profissional"); // Valida o ID antes de buscar
        const schedules = await this.model.findAllSchedules(professional_id);
        return schedules;
    }

    updateStatus = async (id, data, resourceName = "Registro") => {
        this.ValidateId.primaryKey(id, resourceName); // Valida o ID antes de buscar
        // Verifica se o objeto schedule foi fornecido, caso contrário lança um erro
        if (
            !data ||
            Object.keys(data).length === 0
        ) {
            throw new this.ValidationError("Agendamento não fornecido.");
        }

        const { status_id } = data;

        if (!status_id) 
            throw new this.ValidationError("Status não fornecido para atualização.");

        // Cancelados e Concluídos não podem ser editados
        // Pendente --> Confirmado --> Concluído/Cancelado
        // Pendente --> Cancelado
        await this.validateNewStatus(id,status_id);
        const item = await this.model.updateStatus(id, status_id);
        if (!item || item === 0) 
            throw new NotFoundError(`${resourceName} não encontrado para atualização.`);
        
        return item; 
    }

    validateNewStatus = async (id, status) => {
        const newStatus = Number(status);
        const schedule = await this.getById(id, this.resourceName);
        const currentStatus = Number(schedule.status_id);

        if (currentStatus === newStatus)
            throw new this.ValidationError("O agendamento já possui o status informado.");

        switch (currentStatus) {
            // Não pode alterar
            case 4: // Cancelado
            case 3: // Concluído
                throw new this.ValidationError("Não é permitido alterar o status de agendamentos cancelados ou concluídos.");
            // Alteração não permitida
            case 2: // Confirmado
                if (newStatus === 1) // Pendente
                    throw new this.ValidationError("Não é permitido alterar o status de agendamentos de 'confirmado' para 'pendente'.");
                break;
            // Alteração não permitida
            case 1: // Pendente
                if (newStatus === 3) // Concluído
                    throw new this.ValidationError("Agendamentos pendentes devem ser confirmados primeiro.");
                break;
        }

        // Valida se ainda não ultrapassou o horário limite para cancelamento
        if (newStatus === 4) {
            if (!this._hasMinimumTimeAdvance(schedule.start_date_hour)) {
                const hoursText = this.timeBeforeCancellation / (1000 * 60 * 60);
                throw new this.ValidationError(`Agendamentos só podem ser cancelados até ${hoursText} horas antes.`);
            }
        }
        
        // Se estiver tudo certo, apenas continua        
    }

    async reschedule(id, data, resourceName = "Registro") {
        // 1º) Valida tudo
        this.ValidateId.primaryKey(id, resourceName); // Valida o ID antes de buscar
        // informações obrigatórias
        const { start_date_hour, end_date_hour } = data;
        if (!start_date_hour || !end_date_hour) 
            throw new this.ValidationError("Data e hora do novo agendamento são obrigatórios.");

        // 2º) Validações obrigatórias antes das mudanças
        if (!this._hasMinimumTimeAdvance(start_date_hour)) {
            const hoursText = this.timeBeforeCancellation / (1000 * 60 * 60);
            throw new this.ValidationError(`Novos agendamentos devem ser criados com no mínimo ${hoursText} horas de antecedência.`);
        }

        // 3º) Cria o novo agendamento
        if (!data.status_id) data.status_id = 1; // define o status
        const item = await this.create(data); // cria o novo agendamento
        if (!item || item === 0) 
            throw new NotFoundError(`Não foi possível criar o novo horário para ${resourceName}.`);
        
        // 4º) Cancela o agendamento anterior
        try {
            // updateStatus invocará automaticamente validateNewStatus, garantindo a idempotência
            await this.updateStatus(id, { status_id: 4 }, resourceName); 
        } catch (error) {
            // Fallback defensivo: Se a atualização falhar ou violar as regras do agendamento antigo,
            // desfaz a criação do novo para não gerar duplicidade ou dados órfãos.
            if (item.id) {
                await this.delete(item.id); // Ajuste para o seu método de exclusão (ex: this.model.destroy)
            }
            throw error; // Repassa o erro original (ex: "Não é permitido alterar o status...")
        }

        return item; 

    }

    _hasMinimumTimeAdvance(targetDate) {
        const target = new Date(targetDate);
        const now = new Date();
        
        // Calcula a diferença absoluta em milissegundos entre as duas datas
        const differenceInMs = Math.abs(target.getTime() - now.getTime());
        
        // Retorna true se a distância for maior ou igual ao tempo mínimo exigido
        return differenceInMs >= this.timeBeforeCancellation;
    }
}

module.exports = ScheduleService;
// Exporta a classe para ser utilizada pelos controllers
