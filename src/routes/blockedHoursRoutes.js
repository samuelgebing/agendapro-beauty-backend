const BlockedHoursController = require('../controllers/blockedHoursController');
// Importa o controller responsável por gerenciar as ações de horários de profissionais 
const createBaseRouter = require('./baseRouter');
// Importa a função que cria um roteador base com os endpoints de CRUD

// Cria o roteador com todo o CRUD padrão já embutido
const router = createBaseRouter(BlockedHoursController);

// Adicionar rotas específicas, se necessário

module.exports = router;