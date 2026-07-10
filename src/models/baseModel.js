const db = require('../config/database'); // Instância de conexão do banco de dados

/**
 * Classe Base de Modelos para centralizar operações de banco de dados (CRUD).
 */
class BaseModel {
    /**
     * @param {string} tableName - Nome da tabela no banco de dados
     * @param {Array<string>} allowedColumns - Lista de colunas permitidas para escrita/edição
     */
    constructor(tableName, allowedColumns = []) {
        this.tableName = tableName;
        this.allowedColumns = allowedColumns;
        this.db = db; // Instância de conexão do banco de dados
    }

    /**
     * Filtra o corpo da requisição mantendo apenas as colunas autorizadas.
     */
    filterData = (data) => {
        if (this.allowedColumns.length === 0) return data;
        
        const filtered = {};
        this.allowedColumns.forEach(column => {
            if (data[column] !== undefined) {
                filtered[column] = data[column];
            }
        });
        return filtered;
    }

    /**
     * R - READ ALL: Retorna todos os registros da tabela com suporte a filtros dinâmicos.
     * filters = {} --> getAll
     * filters = {'campoUm':valor,'campoDois':valor} --> getByCampoUmAndCampoDois
     */
    findAll = async (filters = {}) => {
        const cleanFilters = this.filterData(filters);
        
        const keys = Object.keys(cleanFilters);
        let query = `SELECT * FROM ${this.tableName}`;
        let values = [];

        if (keys.length > 0) {
            const whereClauses = keys.map(key => `${key} = ?`).join(' AND ');
            query += ` WHERE ${whereClauses}`;
            values = Object.values(cleanFilters);
        }

        const [rows] = await this.db.execute(query, values);
        return rows;
    }

    /**
     * R - READ ONE: Busca um único registro pelo filtro
     */
    findOneBy = async (filters = {}) => {
        const cleanFilters = this.filterData(filters);
        
        const keys = Object.keys(cleanFilters);
        let query = `SELECT * FROM ${this.tableName}`;
        let values = [];

        if (keys.length > 0) {
            const whereClauses = keys.map(key => `${key} = ?`).join(' AND ');
            query += ` WHERE ${whereClauses}`;
            values = Object.values(cleanFilters);
        }

        query += ` LIMIT 1`;

        const [rows] = await this.db.execute(query, values);
        
        // Retorna o primeiro objeto encontrado ou null se o array vier vazio
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * R - READ ONE: Busca um único registro pelo ID primário (MySQL Nativo).
     */
    findById = async (id) => {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
        const [rows] = await this.db.execute(query, [id]);
        
        // Retorna o primeiro objeto encontrado ou null se o array vier vazio
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * C - CREATE: Insere um novo registro no banco (MySQL Nativo).
     */
    create = async (data) => {
        const cleanData = this.filterData(data);
        const columns = Object.keys(cleanData).join(', ');
        const placeholders = Object.keys(cleanData).map(() => '?').join(', ');
        const values = Object.values(cleanData);

        const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
        const [result] = await this.db.execute(query, values);

        // O 'result.insertId' captura o ID numérico gerado automaticamente pelo MySQL
        return { id: result.insertId, ...cleanData };
    }

    /**
     * U - UPDATE: Abordagem de Alta Performance (MySQL Nativo).
     * Retorna 'null' se o registro não existir (affectedRows === 0).
     */
    update = async (id, data) => {
        const cleanData = this.filterData(data);
        const keys = Object.keys(cleanData);

        // Se nenhum campo válido foi enviado para atualização, apenas retorna o registro atual
        if (keys.length === 0) return this.findById(id);

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(cleanData), id]; // Junta os campos com o ID no final do array

        const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
        const [result] = await this.db.execute(query, values);

        // No MySQL2 nativo, usamos affectedRows para saber se o registro foi encontrado
        if (result.affectedRows === 0) {
            return null; 
        }

        // Retorna o objeto completo já atualizado buscando do banco
        return this.findById(id);
    }

    /**
     * D - DELETE: Remove o registro do banco de dados pelo ID (MySQL Nativo).
     */
    delete = async (id) => {
        const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const [result] = await this.db.execute(query, [id]);

        // No MySQL2 nativo, usamos affectedRows para saber se o registro foi encontrado
        if (result.affectedRows === 0) {
            return null; 
        }
        
        return true;
    }
}

module.exports = BaseModel;
