const express = require('express');
const router = express.Router(); // Cria um roteador limpo para ter controle da ordem
const AgendaController = require('../controllers/agendaController');
const createBaseRouter = require('./baseRouter');

// REGISTRA A ROTA ESPECÍFICA PRIMEIRO (Alta prioridade)
// Isso impede que a palavra "available" seja capturada pelo parâmetro dinâmico ":id"
router.get('/available', AgendaController.getAgenda);

// EXTRAI E COPIA AS ROTAS DO CRUD PADRÃO PARA O ROUTER
const baseRouter = createBaseRouter(AgendaController, {
    // getAgenda: [] --> é livre
    // getClientAgenda --> FAZER
    // getProfessionalAgenda --> Fazer
    getAll: [3], // Apenas admins podem ver tudo
    getById: [3], // Apenas admins podem ver detalhes de um agendamento específico

    // Não possui rotas CUD - create, update e delete é em scheduleRoutes
});
router.use('/', baseRouter); 

module.exports = router;
