// Classe para validar se o id tem um formato válido
class ValidateId {
    static isNull(id,entidade = null) {
        if (
            !id && id !== 0 || 
            (typeof id === 'string' && id.trim() === "")
        ) { 
            if(!entidade) // Verifica se é chave estrangeira (se não foi passado o nome da entidade)
                return true; // Indica que deve usar a mensagem personalizada

            // Se foi declarada a entidade, é chave primária - throw error
            const error = new Error(`ID de ${entidade} não fornecido.`); // Define a mensagem de erro
            error.statusCode = 404; // Define o status HTTP para 404 (não encontrado)
            throw error; // Lança o erro com status 404
        }
    }

    static isInvalid(id,entidade = null) {
        id = Number(id); // Converte para NaN se for string
        if (
            Number.isNaN(id) || 
            id <= 0 ||
            !Number.isInteger(id)
        ) {
            if(!entidade) // Verifica se é chave estrangeira (se não foi passado o nome da entidade)
                return true; // Indica que deve usar a mensagem personalizada

            // Se foi declarada a entidade, é chave primária - throw error
            const error = new Error(`ID de ${entidade} com formato inválido.`); // Define a mensagem de erro
            error.statusCode = 400; // Define o status HTTP para 400 (erro de validação)
            throw error; // Lança o erro com status 400
        }
    }

    static primaryKey(id,entidade) {
        this.isNull(id,entidade);
        this.isInvalid(id,entidade);
    }
}

module.exports = ValidateId;
// Exporta a classe para ser utilizada em outros módulos, como nos services