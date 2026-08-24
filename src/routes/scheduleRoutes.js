const express = require('express');
const router = express.Router(); // Cria um roteador limpo para ter controle da ordem
const ScheduleController = require('../controllers/scheduleController');
// Importa o controller responsável por gerenciar as ações da entidade
const createBaseRouter = require('./baseRouter');
// Importa a função que cria um roteador base com os endpoints de CRUD

const AuthMiddleware = require('../middlewares/authMiddleware');

// Adicionar rotas específicas, se necessário
router.patch('/:id', AuthMiddleware.authenticateToken, 
            AuthMiddleware.authorizeRoles([1,2,3]),
            ScheduleController.updateStatus);   // Editar apenas status (PATCH)
router.patch('/:id/reschedule', AuthMiddleware.authenticateToken, 
            AuthMiddleware.authorizeRoles([1,2,3]),
            ScheduleController.reschedule);   
// Define o agendamento com :id como cancelado
// Cria um novo agendamento com os dados enviados

// EXTRAI E COPIA AS ROTAS DO CRUD PADRÃO PARA O ROUTER
const baseRouter = createBaseRouter(ScheduleController, {
// getAll: [], --> Qualquer um pode ver todos os agendamentos 
    getById: [1,2,3], // Cada profissional e cliente pode ver o seu
    create: [1,2,3], // Cada profissional pode criar o seu
    update: [1,2,3], // Cada profissional pode atualizar o seu
    delete: [3]
});
router.use('/', baseRouter); 

module.exports = router;