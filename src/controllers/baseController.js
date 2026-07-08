class BaseController {
    constructor(service, resourceName, customMessages = {}) {
        this.service = typeof service === 'function' ? new service() : service;
        this.resourceName = resourceName;
        this.messages = {
            createSuccess: `${resourceName} criado com sucesso.`,
            updateSuccess: `${resourceName} atualizado com sucesso.`,
            deleteSuccess: `${resourceName} removido com sucesso.`,
            ...customMessages
        };
    }

    // Arrow functions garantem que o escopo do 'this' não se perca no Express
    getAll = async (req, res, next) => {
        try {
            // req.query captura automaticamente restrições da URL
            // EX: { area_id: '1', professional_id = '2' } da URL /services?area_id=1&professional_id=2
            const filters = req.query; 

            const data = await this.service.getAll(filters, this.resourceName);
            return res.status(200).json(data);
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }

    getById = async (req, res, next) => {
        try {
            const data = await this.service.getById(req.params.id, this.resourceName);
            return res.status(200).json(data);
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }

    create = async (req, res, next) => {
        try {
            const data = await this.service.create(req.body, this.resourceName);
            return res.status(201).json({
                message: this.messages.createSuccess,
                data
            });
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }

    update = async (req, res, next) => {
        try {
            const data = await this.service.update(req.params.id, req.body, this.resourceName);
            return res.status(200).json({
                message: this.messages.updateSuccess,
                data
            });
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }

    delete = async (req, res, next) => {
        try {
            await this.service.delete(req.params.id, this.resourceName);
            return res.status(200).json({ message: this.messages.deleteSuccess });
        } catch (error) {
            next(error); // Passa o erro para o middleware de tratamento de erros do Express
        }
    }
}

module.exports = BaseController;
