const express = require('express');
// Importa o framework Express, utilizado para criar o servidor HTTP e gerenciar rotas

const cors = require('cors');
// Importa o middleware que permite o compartilhamento de recursos entre diferentes origens (Cross-Origin Resource Sharing)

const helmet = require('helmet');
// Importa o middleware de segurança que adiciona cabeçalhos HTTP para proteger contra ataques comuns

const userRoutes = require('./routes/userRoutes');
// Importa as rotas relacionadas aos usuários

const serviceRoutes = require('./routes/serviceRoutes');
// Importa as rotas relacionadas aos serviços

const blockedHoursRoutes = require('./routes/blockedHoursRoutes');
// Importa as rotas relacionadas aos horários bloqueados dos profissionais

const workingHoursRoutes = require('./routes/workingHoursRoutes');
// Importa as rotas relacionadas aos horários de trabalho dos profissionais

const scheduleRoutes = require('./routes/scheduleRoutes');
// Importa as rotas relacionadas aos horários dos profissionais

const professionalRoutes = require('./routes/professionalRoutes');
// Importa as rotas relacionadas aos profissionais

const stubRoutesTest = require('./routes/stubRoutes_test');

const errorMiddleware = require('./middlewares/errorMiddleware');
// Importa o middleware para tratamento centralizado de erros

const app = express();
// Cria uma instância do aplicativo Express

// Middlewares globais
app.use(cors());
// Habilita o CORS em todas as rotas da aplicação

app.use(helmet());
// Adiciona proteção automática contra vulnerabilidades HTTP

app.use(express.json());
// Permite que o servidor interprete requisições com corpo em formato JSON

// Rotas da aplicação
app.use('/users', userRoutes);
// Define que todas as requisições iniciadas com /users serão encaminhadas para o arquivo userRoutes

// Rotas da aplicação
app.use('/services', serviceRoutes);
// Define que todas as requisições iniciadas com /services serão encaminhadas para o arquivo serviceRoutes

// Rotas da aplicação
app.use('/blocks', blockedHoursRoutes);
// Define que todas as requisições iniciadas com /blocks serão encaminhadas para o arquivo blockedHoursRoutes

// Rotas da aplicação
app.use('/works', workingHoursRoutes);
// Define que todas as requisições iniciadas com /works serão encaminhadas para o arquivo workingHoursRoutes

// Rotas da aplicação
app.use('/schedules', scheduleRoutes);
// Define que todas as requisições iniciadas com /schedules serão encaminhadas para o arquivo scheduleRoutes

// Rotas da aplicação
app.use('/professionals', professionalRoutes);
// Define que todas as requisições iniciadas com /professionals serão encaminhadas para o arquivo professionalRoutes

app.use('/test-base', stubRoutesTest);

// Middleware de tratamento de erros (deve ser adicionado depois das rotas)
app.use(errorMiddleware);
// Middleware que captura e trata erros, enviando respostas ao cliente

module.exports = app;
// Exporta a aplicação configurada para ser utilizada pelo servidor (server.js)