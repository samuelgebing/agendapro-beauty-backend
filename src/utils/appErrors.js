class AppError extends Error {
    constructor(message, statusCode, options = {}) {
        super(message, options);
        this.statusCode = statusCode;
        this.isOperational = true; // Indica que é um erro de negócio previsto, não um crash do Node
        // Garante que o nome da classe apareça correto no stack trace em vez de apenas "Error"
        this.name = this.constructor.name; 

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Dados inválidos.', options = {}) { super(message, 400, options); }
}

class NotFoundError extends AppError {
    constructor(message = 'Registro não encontrado.', options = {}) { super(message, 404, options); }
}

class ConflictError extends AppError {
    constructor(message = 'Conflito de integridade nos dados.', options = {}) { super(message, 409, options); }
}

module.exports = { AppError, ValidationError, NotFoundError, ConflictError };
