const stubControllerTest = require('../controllers/stubController_test');
const createBaseRouter = require('./baseRouter');

// Cria o roteador REST automatizado herdando as rotas da sua arquitetura
const router = createBaseRouter(stubControllerTest);

module.exports = router;
