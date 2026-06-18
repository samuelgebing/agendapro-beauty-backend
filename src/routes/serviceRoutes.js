// (comecei a criação dos arquivos daqui)
// SPRINT 2: CRUD - Endpoints GET, POST, PUT, DELETE para serviços 

const express = require('express');
// Importa o framework Express

const ServiceController = require('../controllers/serviceController');
// Importa o controller responsável por gerenciar as ações de serviço

const router = express.Router();
// Cria uma nova instância de roteador do Express

// Define a rota para listar todos os serviços
router.get('/', ServiceController.getAll);
// Define a rota para criar um novo serviço
router.post('/', ServiceController.create);
// Define a rota para atualizar um serviço existente pelo ID
router.put('/:id', ServiceController.update);
// Define a rota para deletar um serviço pelo ID
router.delete('/:id', ServiceController.delete);

module.exports = router;
// Exporta o roteador configurado para ser usado no app principal