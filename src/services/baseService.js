// IMPORTAÇÕES PARA BaseService E TODAS AS CLASSES FILHAS
const ValidateId = require("../utils/validateId");
const ValidateTime = require("../utils/validateTime");
const { 
    AppError, ValidationError, NotFoundError, ConflictError 
} = require('../utils/appErrors'); 
// Importa a classe de erro

class BaseService {
    constructor(model) {
        this.model = typeof model === 'function' ? new model() : model;
        this.ValidateId = ValidateId; 
        this.ValidateTime = ValidateTime; 
        // Disponibiliza a classe ValidateId para as classes filhas

        this.AppError = AppError;
        this.ValidationError = ValidationError;
        this.NotFoundError = NotFoundError;
        this.ConflictError = ConflictError;
        // Disponibiliza as classes de erro em todas as classes filhas
    }

    // Busca todos os registros cadastrados
    getAll = async (filters = {}, resourceName = "Registros") => { 
        // HOOK DE VALIDAÇÃO DE FILTROS: Executa se existir na classe filha
        if (
            typeof this.validateFilters === 'function' && 
            Object.keys(filters).length > 0
        ) {
            await this.validateFilters(filters, resourceName);
        }

        return await this.model.findAll(filters); 
    }
    
    // Busca um registro pelo id
    getById = async (id, resourceName = "Registro") => {
        this.ValidateId.primaryKey(id, resourceName); // Valida o ID antes de buscar

        const item = await this.model.findOneBy({'id':id});
        if (!item) throw new NotFoundError(`${resourceName} não encontrado.`);
        return item;
    }

    create = async (data, resourceName = "Registro") => {
        // HOOK DE VALIDAÇÃO: Se a classe filha tiver o método 'validate', ele roda aqui
        if (typeof this.validate === 'function') await this.validate(data);
        
        // Se a validação não lançar nenhum erro, o fluxo continua normalmente:
        const item = await this.model.create(data);
        if (!item || item === 0)
            throw new AppError(`Falha ao criar ${resourceName}.`, 500);
        
        return item;
    }

    update = async (id, data, resourceName = "Registro") => {
        this.ValidateId.primaryKey(id, resourceName); // Valida o ID antes de buscar
        // HOOK DE VALIDAÇÃO: Se a classe filha tiver o método 'validate', ele roda aqui
        if (typeof this.validate === 'function') await this.validate(data); 

        const item = await this.model.update(id, data);
        if (!item || item === 0) 
            throw new NotFoundError(`${resourceName} não encontrado para atualização.`);
        
        return item; 
    }

    delete = async (id, resourceName = "Registro") => {
        this.ValidateId.primaryKey(id, resourceName); // Valida o ID antes de buscar
        const item = await this.model.delete(id);
        console.log(item);
        if (!item || item === 0) 
            throw new NotFoundError(`${resourceName} não encontrado para exclusão.`);
                
        return true;
    }
}

module.exports = BaseService;
