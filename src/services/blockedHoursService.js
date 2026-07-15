const BaseService = require("./baseService");
// Importa a classe base com os métodos CRUD genéricos
const BlockedHoursModel = require("../models/blockedHoursModel");
// Importa o Model responsável pelo acesso ao banco de dados (tabela schedules)
const ProfessionalModel = require("../models/professionalModel");
// Importa o Model para validar o professional_id

class BlockedHoursService extends BaseService {
    constructor() {
        super(BlockedHoursModel);
    }

    // Valida os dados do horário antes de criar ou atualizar
    // OBS: sem id
    async validate(blockedHour) {
        // Verifica se o objeto blockedHour foi fornecido, caso contrário lança um erro
        if (
            !blockedHour || 
            Object.keys(blockedHour).length === 0
        ) {
            throw new this.ValidationError("Bloqueio de Horário não fornecido.");
        }

        const errors = [];
        // Verifica campos obrigatórios
        if (this.ValidateId.isNull(blockedHour.professional_id)) 
            errors.push("Profissional não fornecido.");
        if (!blockedHour.start) errors.push("Data de início do bloqueio não fornecida.");
        if (!blockedHour.end) errors.push("Data de término do bloqueio não fornecida.");
        if (!blockedHour.reason) errors.push("Motivo não fornecido.");
        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            throw new this.ValidationError(errors.join(" ")); // Cria um erro com todas as mensagens de validação
        }
            // Une em um erro todas as mensagens de validação de campos obrigatórios

        // VALIDAÇÕES DE PROFESSIONAL_ID
        if (this.ValidateId.isInvalid(blockedHour.professional_id)) 
            errors.push("ID de profissional com formato inválido.");

        // FAZER: 
        // VALIDAÇÕES DE DATA DE INÍCIO E TÉRMINO
        if (typeof blockedHour.start !== "string") 
            errors.push("Data de início com formato inválido.");
        if (typeof blockedHour.end !== "string") 
            errors.push("Data de término com formato inválido.");

        if (errors.length > 0) { 
            errors[0] = "FALHA NA VALIDAÇÃO DO HORÁRIO: " + errors[0]; // Prefixa a primeira mensagem de erro
            const error = new Error(errors.join(" ")); // Cria um erro com todas as mensagens de validação
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status code
        }

        // Verifica se o id da área do serviço já existe no banco apenas se as demais validações passarem
        const existingProfessionalId = await ProfessionalModel.findById(blockedHour.professional_id);
        if (!existingProfessionalId || existingProfessionalId == ""){
            throw new this.NotFoundError("Profissional não encontrado.");
        }
        
        // Se todas as validações passarem, apenas continua sem lançar erros
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

module.exports = BlockedHoursService;
// Exporta a classe para ser utilizada pelos controllers
