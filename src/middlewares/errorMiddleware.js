// Dicionário mapeando códigos nativos do MySQL2 para status HTTP e mensagens amigáveis
const MYSQL_ERROR_MAP = {
    'ER_DUP_ENTRY': {
        status: 409,
        message: 'Este registro já está cadastrado no sistema.'
    },
    'ER_NO_REFERENCED_ROW_2': {
        status: 400,
        message: 'Não foi possível vincular o registro: O ID de relacionamento informado não existe.'
    },
    'ER_NO_REFERENCED_ROW': {
        status: 400,
        message: 'Não foi possível vincular o registro: O ID de relacionamento informado não existe.'
    },
    'ER_ROW_IS_REFERENCED_2': {
        status: 409,
        message: 'Não é possível remover este registro pois ele possui outros dados vinculados a ele.'
    },
    'ER_ROW_IS_REFERENCED': {
        status: 409,
        message: 'Não é possível remover este registro pois ele possui outros dados vinculados a ele.'
    },
    'ER_BAD_FIELD_ERROR': {
        status: 500,
        message: 'Erro interno na estrutura de dados do servidor.'
    }
};

// Middleware para captura de erros em toda a aplicação
function errorMiddleware(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let errorMessage = err.message || 'Erro interno no servidor';

    // 1. Intercepta erros específicos do MySQL2 usando o dicionário
    if (err.code && MYSQL_ERROR_MAP[err.code]) {
        statusCode = MYSQL_ERROR_MAP[err.code].status;
        errorMessage = MYSQL_ERROR_MAP[err.code].message;
    }

    // 2. Monta a estrutura padrão da resposta JSON
    const errorResponse = {
        success: false,
        error: errorMessage,
        status: statusCode,
        timestamp: new Date().toISOString()
    };
    
    // 3. Melhor Prática: Separação por Ambiente (.env)
    if (process.env.NODE_ENV === 'development') {
        // Em desenvolvimento, imprime no terminal e devolve o stack no JSON para te ajudar
        console.error(`\n🔥 [${req.method}] ${req.url} - Error Stack:`, err.stack, '\n');
        errorResponse.stack = err.stack; 
        errorResponse.rawError = err; // Mostra propriedades extras (ex: o .code do mysql)

        // Se existir uma causa original (o erro do banco), anexa ela detalhadamente no JSON de dev

        if (err.cause) {
            errorResponse.rawError = {
                message: err.cause.message,
                code: err.code || err.cause.code,
                errno: err.errno || err.cause.errno,
                sqlMessage: err.sqlMessage || err.cause.sqlMessage,
                sql: err.sql || err.cause.sql,
                dbStack: err.cause.stack // O stack original do baseModel.js fica guardado aqui de forma limpa
            };
        } else {
            errorResponse.rawError = err;
        }
    } else {
        // Em produção, faz o log silencioso e limpo para o administrador
        console.error(`🚨 [ERROR_LOG] [${new Date().toISOString()}] [${req.method}] ${req.url} - ${errorMessage}`);
    }

    return res.status(statusCode).json(errorResponse);
}

module.exports = errorMiddleware;
// Exporta o middleware para ser utilizado no app.js
