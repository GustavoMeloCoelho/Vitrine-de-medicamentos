import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./database/data-source";
import userRoutes from "./routes/userRoutes";
import medicamentoRoutes from "./routes/medicamentoRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(medicamentoRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conectado ao banco de dados!");
    
    app.listen(3333, () => {
      console.log("🚀 Servidor rodando na porta 3333");
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao conectar ao banco:", error);
  });
