const express = require('express');
// Importa o framework Express

/**
 * Cria um roteador Express com os endpoints padrões de CRUD mapeados.
 * @param {Object} controller - O controller que herda de BaseController
 * @returns {express.Router} Roteador configurado
 */
function createBaseRouter(controller) {
    const router = express.Router();
    // Cria uma nova instância de roteador do Express

    // Mapeia o CRUD usando os métodos padrões da BaseController
    router.get('/', controller.getAll);       // Listar todos
    router.get('/:id', controller.getById);     // Buscar por ID
    router.post('/', controller.create);      // Criar (POST)
    router.put('/:id', controller.update);   // Editar (PUT)
    router.delete('/:id', controller.delete); // Deletar (DELETE)

    return router;
    // Retorna o roteador configurado para ser usado no app principal
}

module.exports = createBaseRouter;
// Exporta a função que cria o roteador base
