const BaseService = require("./baseService");
const StubModelTest = require("../models/stubModel_test");

class StubServiceTest extends BaseService {
    constructor() {
        super(StubModelTest);
    }

    // Simula as lógicas de validação consumindo os utilitários da sua classe base
    async validate(stub) {
        if (!stub) {
            throw new this.ValidationError("Objeto de teste não fornecido.");
        }

        const errors = [];

        // Validações obrigatórias estruturais
        if (!stub.name) errors.push("Nome de teste não fornecido.");
        
        if (errors.length > 0) {
            errors[0] = "FALHA NA VALIDAÇÃO DO STUB: " + errors[0];
            throw new this.ValidationError(errors.join(" "));
        }

        // Validação de formato/tipo usando tipos primitivos
        if (typeof stub.name !== "string") {
            errors.push("Nome deve ser uma string.");
        }

        if (stub.name.length < 2 || stub.name.length > 100) {
            errors.push("Nome deve ter entre 2 e 100 caracteres.");
        }

        // Simulação de erro de conflito (Regra de Negócio)
        if (stub.name === "Conflito") {
            throw new this.ConflictError("Registro com esse nome já existe.");
        }

        if (errors.length > 0) {
            errors[0] = "FALHA NA VALIDAÇÃO DO STUB: " + errors[0];
            throw new this.ValidationError(errors.join(" "));
        }
    }

    async validateFilters(filters) {
        if (filters.id) {
            this.ValidateId.primaryKey(filters.id, "Stub");
        }

        return filters;
    }
}

module.exports = StubServiceTest;
