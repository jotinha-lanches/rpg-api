import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "RPG Battle API",
    description: "API para gerenciar personagens e batalhas em RPG.",
    version: "1.0.0",
  },
  host: "localhost:3333",
  basePath: "/",
  schemes: ["http"],
  tags: [
    {
      name: "Batalha",
      description: "Gerenciamento de personagens na batalha",
    },
  ],
  definitions: {
    PersonagemBatalha: {
      nome: "Aragorn",
      pontosVida: 120,
      iniciativa: 15,
      classeArmadura: 18,
      cdMagia: 12,
      condicoes: ["ferido", "cansado"],
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["src/index.js", "./src/routes/**/*.js"];

swaggerAutogen(outputFile, routes, doc).then(() => {
  console.log("🚀 Swagger JSON gerado com sucesso!");
});
