const ScheduleController = require('../controllers/scheduleController');
// Importa o controller responsável por gerenciar as ações da entidade
const createBaseRouter = require('./baseRouter');
// Importa a função que cria um roteador base com os endpoints de CRUD

// Cria o roteador com todo o CRUD padrão já embutido
const router = createBaseRouter(ScheduleController);

// Adicionar rotas específicas, se necessário
router.patch('/:id', ScheduleController.updateStatus);   // Editar apenas status (PATCH)
router.patch('/:id/reschedule', ScheduleController.reschedule);   
// Define o agendamento com :id como cancelado
// Cria um novo agendamento com os dados enviados

module.exports = router;