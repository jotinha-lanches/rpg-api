import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import apiV1Routes from "./routes/api/v1/index.js";

import swaggerFile from "../swagger-file.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Garantir que as rotas sejam montadas corretamente
app.use("/api/v1", apiV1Routes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
