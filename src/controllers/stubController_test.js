const BaseController = require('./baseController'); 
const StubServiceTest = require('../services/stubService_test'); 

class StubControllerTest extends BaseController {
    constructor() {
        // Injeta a classe do serviço e define o nome da entidade para mensagens automáticas
        super(StubServiceTest, "Stub de Teste");
    }
}

module.exports = new StubControllerTest();
