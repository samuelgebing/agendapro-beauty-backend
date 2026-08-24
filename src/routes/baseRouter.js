const express = require('express');
// Importa o framework Express

const AuthMiddleware = require('../middlewares/authMiddleware');
const isOwnerOrAdmin = require('../middlewares/ownershipMiddleware');

/**
 * Cria um roteador Express com os endpoints padrões de CRUD mapeados.
 * @param {Object} controller - O controller que herda de BaseController
 * @returns {express.Router} Roteador configurado
 */
/*
- 0 ou não declarado = visitante (não logado) (OPCIONAL)
- 1 = cliente
- 2 = profissional
- 3 = admin
*/
function createBaseRouter(controller, permissions = {}) {
    const router = express.Router();
    // Cria uma nova instância de roteador do Express

    if (permissions && permissions.getAll) {
        router.get('/', 
            AuthMiddleware.authenticateToken, 
            AuthMiddleware.authorizeRoles(permissions.getAll),
            controller.getAll
        );
    } else {
        router.get('/', controller.getAll);
    }

    if (permissions && permissions.getById) {
        router.get('/:id', 
            AuthMiddleware.authenticateToken, 
            AuthMiddleware.authorizeRoles(permissions.getById),
            // isOwnerOrAdmin,
            // FAZER
            controller.getById
        );
    } else {
        router.get('/:id', controller.getById);
    }

    if (permissions && permissions.create) {
        router.post('/', 
            AuthMiddleware.authenticateToken, 
            AuthMiddleware.authorizeRoles(permissions.create),
            controller.create
        );
    } else {
        router.post('/', controller.create);
    }

    if (permissions && permissions.update) {
        router.put('/:id', 
            AuthMiddleware.authenticateToken, 
            AuthMiddleware.authorizeRoles(permissions.update),
            // isOwnerOrAdmin,
            // FAZER
            controller.update
        );
    } else {
        router.put('/:id', controller.update);
    }
    
    if (permissions && permissions.delete) {
        router.delete('/:id', 
            AuthMiddleware.authenticateToken, 
            AuthMiddleware.authorizeRoles(permissions.delete),
            // isOwnerOrAdmin,
            // FAZER
            controller.delete
        );
    } else {
        router.delete('/:id', controller.delete);
    }

    return router;
    // Retorna o roteador configurado para ser usado no app principal
}

module.exports = createBaseRouter;
// Exporta a função que cria o roteador base 
