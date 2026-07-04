class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Indica que é um erro de negócio previsto, não um crash do Node
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Dados inválidos.') { super(message, 400); }
}

class NotFoundError extends AppError {
    constructor(message = 'Registro não encontrado.') { super(message, 404); }
}

class ConflictError extends AppError {
    constructor(message = 'Conflito de integridade nos dados.') { super(message, 409); }
}

module.exports = { AppError, ValidationError, NotFoundError, ConflictError };
