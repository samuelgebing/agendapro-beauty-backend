// (comecei a criação dos arquivos daqui)
// SPRINT 2: CRUD - Endpoints GET, POST, PUT, DELETE para profissionais 

const express = require('express');
// Importa o framework Express

const ProfessionalController = require('../controllers/professionalController');
// Importa o controller responsável por gerenciar as ações de profissional

const router = express.Router();
// Cria uma nova instância de roteador do Express

// Define a rota para listar todos os profissionais
router.get('/', ProfessionalController.getAll);
// Define a rota para criar um novo profissional
router.post('/', ProfessionalController.create);
// Define a rota para atualizar um profissional existente pelo ID
router.put('/:id', ProfessionalController.update);
// Define a rota para deletar um profissional pelo ID
router.delete('/:id', ProfessionalController.delete);

module.exports = router;
// Exporta o roteador configurado para ser usado no app principal