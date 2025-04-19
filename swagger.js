const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "API de Fichas D&D",
        description: "API para cadastro e gerenciamento de fichas de personagens de D&D."
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: "Servidor local"
        }
    ]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index'); // Ponto de entrada da aplicação
});
