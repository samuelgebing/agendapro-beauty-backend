const BaseModel = require("./baseModel");

class StubModelTest extends BaseModel {
    constructor() {
        // Envia o nome da tabela cobaia e o array de colunas permitidas
        super('test_stubs', ['name', 'description']);
    }
}

module.exports = StubModelTest;
