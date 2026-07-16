const express = require('express');
const router = express.Router(); // Cria um roteador limpo para ter controle da ordem
const AgendaController = require('../controllers/agendaController');
const createBaseRouter = require('./baseRouter');

// 1. REGISTRA A ROTA ESPECÍFICA PRIMEIRO (Alta prioridade)
// Isso impede que a palavra "available" seja capturada pelo parâmetro dinâmico ":id"
router.get('/available', AgendaController.getAgenda);

// 2. EXTRAI E COPIA AS ROTAS DO CRUD PADRÃO PARA O NOSSO ROTEADOR
const baseRouter = createBaseRouter(AgendaController);
router.use('/', baseRouter); 

module.exports = router;
