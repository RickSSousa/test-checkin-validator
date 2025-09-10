import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { swaggerSpec } from "./docs/swagger.config";
import healthRoutes from "./routes/health.routes";
import uploadRoutes from "./routes/upload.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use("/", healthRoutes);
app.use("/", uploadRoutes);

// Middleware de tratamento de erros
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Erro não tratado:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Erro interno do servidor",
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Endpoints disponíveis:`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /upload`);
});
