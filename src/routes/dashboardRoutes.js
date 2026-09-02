const express = require('express');
const router = express.Router(); // Cria um roteador limpo para ter controle da ordem
const DashboardController = require('../controllers/dashboardController');
const createBaseRouter = require('./baseRouter');

// EXTRAI E COPIA AS ROTAS DO CRUD PADRÃO PARA O ROUTER
const baseRouter = createBaseRouter(DashboardController, {
    getDashboard: [3], // Apenas admins podem ver tudo
    // Não possui rotas CUD 
    // - create, update e delete é nas respectivas entidades 
    // Assim como getById, que é feito nas respectivas entidades
});
router.get('/', DashboardController.getDashboard); 
router.use('/', baseRouter); 

module.exports = router;
