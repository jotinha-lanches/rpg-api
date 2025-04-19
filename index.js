const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const fichaPersonagemRoutes = require('./src/domain/ficha-personagem/routes/fichaPersonagem.routes');
const batalhaRoutes = require('./src/domain/batalha/routes/batalha.routes');

const app = express();
const PORT = process.env.PORT || 666;

app.use(express.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Garantir que as rotas sejam montadas corretamente
app.use('/batalha', batalhaRoutes);

app.use('/ficha-personagem', fichaPersonagemRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
