const express = require('express');
// Importa o framework Express

const AuthController = require('../controllers/auth.controller');
// Importa o controller responsável por gerenciar as ações de autenticação (registro e login)

const router = express.Router();
// Cria uma nova instância do roteador do Express para definir as rotas relacionadas à autenticação

router.post('/create', AuthController.create);
// Define a rota POST /create que chama o método create do AuthController

router.post('/login', AuthController.login);
// Define a rota POST /login que chama o método login do AuthController

module.exports = router;
// Exporta o roteador para ser utilizado na aplicação