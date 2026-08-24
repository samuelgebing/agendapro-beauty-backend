const express = require('express');
const router = express.Router(); // Cria um roteador limpo para ter controle da ordem
const UserController = require('../controllers/userController');
// Importa o controller responsável por gerenciar as ações da entidade
const createBaseRouter = require('./baseRouter');
// Importa a função que cria um roteador base com os endpoints de CRUD

router.post('/login', UserController.login);   // Editar apenas status (PATCH)???

// EXTRAI E COPIA AS ROTAS DO CRUD PADRÃO PARA O ROUTER
const baseRouter = createBaseRouter(UserController, {
    getAll: [3], // Apenas admins podem ver tudo
    getById: [1,2,3], // Cada usuário pode ver o seu
    // create: [0,3], // FAZER: apenas visitantes e admins
    update: [1,2,3], // Cada usuário pode atualizar o seu
    delete: [1,2,3] // admins podem excluir todos, outros apenas o seu
});
router.use('/', baseRouter); 

module.exports = router;