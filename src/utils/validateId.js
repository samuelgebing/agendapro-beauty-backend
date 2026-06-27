// Classe para validar se o id tem um formato válido
class ValidateId {
    static isNull(id,entity = null) {
        if (
            !id && id !== 0 || 
            (typeof id === 'string' && id.trim() === "")
        ) { 
            if(!entity) // Verifica se é chave estrangeira (se não foi passado o nome da entidade)
                return true; // Indica que deve usar a mensagem personalizada

            // Se foi declarada a entidade, é chave primária - throw error
            const error = new Error(`ID de ${entity} não fornecido.`); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }
    }

    static isInvalid(id,entity = null) {
        id = Number(id); // Converte para NaN se for string
        if (
            Number.isNaN(id) || 
            id <= 0 ||
            !Number.isInteger(id)
        ) {
            if(!entity) // Verifica se é chave estrangeira (se não foi passado o nome da entidade)
                return true; // Indica que deve usar a mensagem personalizada

            // Se foi declarada a entidade, é chave primária - throw error
            const error = new Error(`ID de ${entity} com formato inválido.`); // Define a mensagem de erro
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status 400
        }
    }

    static primaryKey(id,entity) {
        this.isNull(id,entity);
        this.isInvalid(id,entity);
    }
}

module.exports = ValidateId;
// Exporta a classe para ser utilizada em outros módulos, como nos services