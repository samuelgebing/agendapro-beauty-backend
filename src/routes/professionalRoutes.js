const ProfessionalController = require('../controllers/professionalController');
// Importa o controller responsável por gerenciar as ações da entidade
const createBaseRouter = require('./baseRouter');
// Importa a função que cria um roteador base com os endpoints de CRUD

// Cria o roteador com todo o CRUD padrão já embutido
const router = createBaseRouter(ProfessionalController);

// Adicionar rotas específicas, se necessário

module.exports = router;