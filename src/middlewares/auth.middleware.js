const jwt = require('jsonwebtoken');
// Importa a biblioteca JWT para verificar e decodificar tokens de autenticação

// Middleware para autenticar o token JWT enviado pelo cliente
function authenticateToken(req, res, next) {
    // Recupera o cabeçalho de autorização da requisição
    const authHeader = req.headers['authorization'];

    // Extrai o token do cabeçalho no formato "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    // Se não houver token, responde com status 401 (Não autorizado)
    if (!token) return res.sendStatus(401);

    // Verifica e valida o token usando a chave secreta definida no .env
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido: acesso proibido

        // Se o token for válido, adiciona os dados do usuário decodificados na requisição
        req.user = user;

        // Passa para o próximo middleware ou rota
        next();
    });
}

// Middleware para autorizar o acesso com base na função (role) do usuário
function authorizeRole(role) {
    return (req, res, next) => {
        // Normaliza roles para número para aceitar perfil_id numérico
        if (Number(req.user.role) !== Number(role)) {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };
// Exporta os middlewares para serem usados nas rotas protegidas