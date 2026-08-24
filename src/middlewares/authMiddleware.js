const jwt = require('jsonwebtoken');
// Importa a biblioteca JWT para verificar e decodificar tokens de autenticação

class AuthMiddleware {
    constructor() {
        // Define o secret diretamente ou injeta dependências aqui se necessário
        this.jwtSecret = process.env.JWT_SECRET;

        // Garante que o 'this' aponte para a classe mesmo quando chamado pelo Express
        this.authenticateToken = this.authenticateToken.bind(this);
        this.authorizeRoles = this.authorizeRoles.bind(this);
    }

    // Função para autenticar o token JWT enviado pelo cliente
    authenticateToken(req, res, next) {
        // Recupera o cabeçalho de autorização da requisição
        const authHeader = req.headers['authorization'];
        
        // Garante que o formato começa com 'Bearer ' antes de extrair
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token de autenticação ausente ou inválido' });
        }

        // Extrai o token do cabeçalho no formato "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // Se não houver token, responde com status 401 (Não autorizado)
        if (!token) return res.status(401).json({ message: 'Token não fornecido' });

        // Verifica e valida o token usando a chave secreta definida no .env
        jwt.verify(token, this.jwtSecret, (err, user) => {
            if (err) {
                // Diferencia token expirado de token corrompido
                const message = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
                return res.status(403).json({ message });
            }

            // Se o token for válido, adiciona os dados do usuário decodificados na requisição
            req.user = user;

            // Passa para o próximo middleware ou rota
            next();
        });
    }
    // CONTINUAR AQUI:
    // Middleware para autorizar o acesso com base na função (role) do usuário
    authorizeRoles(allowedRoles) {
        // Transforma em array se receber apenas um número/string
        const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        return (req, res, next) => {
            if (!req.user || !req.user.role) 
                return res.status(403).json({ message: 'Perfil de usuário não identificado' });

            // Converte ambos para número para evitar problemas de tipo (String vs Number)
            const userRole = Number(req.user.role);
            const hasPermission = rolesArray.map(Number).includes(userRole);

            // Normaliza roles para número para aceitar perfil_id numérico
            if (!hasPermission)
                return res.status(403).json({ message: 'Acesso negado: privilégios insuficientes' });

            next();
        };
    }
}

module.exports = new AuthMiddleware();
// Exporta os middlewares para serem usados nas rotas protegidas