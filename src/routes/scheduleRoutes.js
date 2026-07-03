// (comecei a criação dos arquivos daqui)
// SPRINT 2: CRUD - Endpoints GET, POST, PUT, DELETE para serviços 

const express = require('express');
// Importa o framework Express

const ScheduleController = require('../controllers/scheduleController');
// Importa o controller responsável por gerenciar as ações de horários de profissionais 

const router = express.Router();
// Cria uma nova instância de roteador do Express

// Define a rota para listar todos os horários de profissionais
router.get('/', ScheduleController.getAll);
// Define a rota para criar um novo horário de profissional
router.post('/', ScheduleController.create);
// Define a rota para atualizar um horário de profissional existente pelo ID
router.put('/:id', ScheduleController.update);
// Define a rota para deletar um horário de profissional pelo ID
router.delete('/:id', ScheduleController.delete);

module.exports = router;
// Exporta o roteador configurado para ser usado no app principal