const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const DashboardModel = require("../models/dashboardModel");
// Importa o Model responsável pelo acesso ao banco de dados
const ScheduleService = require("./scheduleService");
// Importa o Service para validações

class DashboardService extends BaseService {
    constructor() {
        super(DashboardModel);

        this.scheduleService = new ScheduleService();
    }

    /**
     * Valida os filtros recebidos pela URL 
     * EX: (?speciality_id=1)
     */
    async validateFilters(filters = {}, resourceName) {
        // Se o usuário passou o filtro professional_id na URL
        if (filters.professional_id)
            this.ValidateId.primaryKey(filters.professional_id, resourceName);
        
        
         if (filters && 'date' in filters) {
            if (this.ValidateTime.isInvalid(filters.date)) {
                throw new this.ValidationError("Formato de data inválido, use YYYY-MM-DD.");
            }
            
            const { date, ...filteredFilters } = filters;
        
            return {
                ...filteredFilters,
                start: `${date} 00:00:00`,
                end: `${date} 23:59:59`
            };
        }
            
        // Adicionar validações para outros filtros da URL aqui...

        return filters;
    }

    _validateDates(blockedHours) {
        // Função auxiliar interna para formatar um único objeto
        const formatItem = (item) => {
            const plainItem = typeof item.toJSON === 'function' ? item.toJSON() : item;
            return {
                ...plainItem,
                start: plainItem.start instanceof Date ? plainItem.start.toLocaleString('sv-SE') : plainItem.start,
                end: plainItem.end instanceof Date ? plainItem.end.toLocaleString('sv-SE') : plainItem.end
            };
        };

        // Se for um array, processa todos os itens; se for um único objeto, processa apenas ele
        return Array.isArray(blockedHours) ? blockedHours.map(formatItem) : formatItem(blockedHours);
    }

    async getDashboard(filters = {}, resourceName = "Dashboard") {
        // Total geral
        const allSchedules = await this.model.countAllSchedules();
        
        let schedulesByProfessional;
        let schedulesByStatus;
        let schedulesByClient;
        let schedulesByDateRange;

        // Total por profissional (com/sem id)
        if (filters.professional_id) {
            schedulesByProfessional = await this.model.countSchedulesByProfessional(filters.professional_id);
        } else {
            schedulesByProfessional = await this.model.countSchedulesByProfessional();
        }

        // Total por status (com/sem id)
        if (filters.status_id) {
            schedulesByStatus = await this.model.countSchedulesByStatus(filters.status_id);
        } else {
            schedulesByStatus = await this.model.countSchedulesByStatus();
        }

        // Total por cliente (com/sem id)
        if (filters.user_id) {
            schedulesByClient = await this.model.countSchedulesByClient(filters.user_id);
        } else {
            schedulesByClient = await this.model.countSchedulesByClient();
        }

        // Total por período (com/sem id)
        if (filters.start && filters.end) {
            schedulesByDateRange = await this.model.countSchedulesByDateRange(filters.start, filters.end);
        } else {
            schedulesByDateRange = await this.model.countSchedulesByDateRange();
        }

        return {
            total_agendamentos: allSchedules,
            agendamentos_por_profissional: schedulesByProfessional,
            agendamentos_por_status: schedulesByStatus,
            agendamentos_por_cliente: schedulesByClient,
            agendamentos_por_periodo: schedulesByDateRange
        };
    }



    // Busca todos os registros cadastrados
    // Precisa repetir para validar o formato das datas
    getAll = async (filters = {}, resourceName = "Registros") => { 
        // HOOK DE VALIDAÇÃO DE FILTROS: Executa se existir na classe filha
        let date = '';
        if (filters.date)
            date = filters.date;

        if (
            typeof this.validateFilters === 'function' && 
            Object.keys(filters).length > 0
        ) {
            filters = await this.validateFilters(filters, resourceName);
        }   

        let items = '';
        if (filters.professional_id && date !== '') {
            items = await this.getByProfessionalAndDate(filters.professional_id, filters.start, filters.end);
        } else if (filters.professional_id) {
            items = await this.getByProfessionalId(filters.professional_id);
        } else if (date !== '') {
            items = await this.getByDate(filters.start, filters.end);
        } else { items = await this.model.findAll(filters); }

        return this._validateDates(items);
    }
    
    // Busca um registro pelo id
    // Precisa repetir para validar o formato das datas
    getById = async (id, resourceName = "Registro") => {
        this.ValidateId.primaryKey(id, resourceName); // Valida o ID antes de buscar

        const item = await this.model.findById(id);
        if (!item) throw new NotFoundError(`${resourceName} não encontrado.`);
        return this._validateDates(item);
    }
    
    // Busca um registro pelo professional_id
    getByProfessionalId = async (professionalId) => {
        this.ValidateId.primaryKey(professionalId, 'Profissional'); // Valida o ID antes de buscar

        const item = await this.model.findByProfessionalId(professionalId);
        if (!item) throw new NotFoundError(`Nenhum "${resourceName}" encontrado.`);
        return this._validateDates(item);
    }

    getByDate = async (start, end) => {
        const item = await this.model.findByDate(start, end);
        if (!item) throw new NotFoundError(`Nenhum "${resourceName}" encontrado.`);
        return this._validateDates(item);
    }
    
    // Busca um registro pelo professional_id e pela data
    getByProfessionalAndDate = async (professionalId, start, end) => {
        this.ValidateId.primaryKey(professionalId, 'Profissional'); // Valida o ID antes de buscar

        const item = await this.model.findByProfessionalAndDate(professionalId,start, end);
        if (!item) throw new NotFoundError(`Nenhum "${resourceName}" encontrado.`);
        return this._validateDates(item);
    }
}

module.exports = DashboardService;
// Exporta a classe para ser utilizada pelos controllers
