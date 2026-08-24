const express = require('express');
const router = express.Router(); // Cria um roteador limpo para ter controle da ordem
const WorkingHoursController = require('../controllers/workingHoursController');
// Importa o controller responsável por gerenciar as ações da entidade
const createBaseRouter = require('./baseRouter');
// Importa a função que cria um roteador base com os endpoints de CRUD

// EXTRAI E COPIA AS ROTAS DO CRUD PADRÃO PARA O ROUTER
const baseRouter = createBaseRouter(WorkingHoursController, {
    getAll: [3], // Apenas admins podem ver tudo
    getById: [2,3], // Cada profissional pode ver o seu
    create: [2,3], // Cada profissional pode criar o seu
    update: [2,3], // Cada profissional pode atualizar o seu
    delete: [3]
});
router.use('/', baseRouter); 

module.exports = router;