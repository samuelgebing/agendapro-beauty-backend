/**
 * Garante que o usuário logado só possa manipular o próprio ID, 
 * a menos que ele seja um Administrador (Role 3).
 */
function isOwnerOrAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const loggedUserId = Number(req.user.id); // ID vindo do token JWT
    const targetId = Number(req.params.id);    // ID vindo da URL (/:id)
    const loggedUserRole = Number(req.user.role);

    // Se for Admin (3), tem passe livre para qualquer ID
    if (loggedUserRole === 3) {
        return next();
    }

    // Se NÃO for admin, o ID da URL OBRIGATORIAMENTE deve ser igual ao ID do Token
    if (loggedUserId !== targetId) {
        return res.status(403).json({ 
            message: 'Acesso negado: Você não tem permissão para alterar dados de terceiros.' 
        });
    }

    next();
}

module.exports = isOwnerOrAdmin;
