// (comecei a criação dos arquivos daqui)
// SPRINT 2: CRUD - Endpoints GET, POST, PUT, DELETE para serviços 

const express = require('express');
// Importa o framework Express

const BlockedScheduleController = require('../controllers/blockedScheduleController');
// Importa o controller responsável por gerenciar as ações de horários de profissionais 

const router = express.Router();
// Cria uma nova instância de roteador do Express

// Define a rota para listar todos os horários bloqueados de profissionais
router.get('/blocks', BlockedScheduleController.getAll);
// Define a rota para criar um novo horário bloqueado de profissional
router.post('/blocks', BlockedScheduleController.create);
// Define a rota para atualizar um horário bloqueado de profissional existente pelo ID
router.put('/blocks/:id', BlockedScheduleController.update);
// Define a rota para deletar um horário bloqueado de profissional pelo ID
router.delete('/blocks/:id', BlockedScheduleController.delete);

module.exports = router;
// Exporta o roteador configurado para ser usado no app principal