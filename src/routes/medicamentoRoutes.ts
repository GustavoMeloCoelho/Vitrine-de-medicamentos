import { Router } from "express";
import { MedicamentoController } from "../controllers/MedicamentoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

// Criar medicamento (somente admin ou farmacêutico)
router.post("/medicamentos", authMiddleware, roleMiddleware(["admin", "farmaceutico"]), MedicamentoController.createMedicamento);

// Listar medicamentos (todos autenticados podem acessar)
router.get("/medicamentos/all", authMiddleware, MedicamentoController.listarTodosMedicamentos);
router.get("/medicamentos", authMiddleware, MedicamentoController.listarMedicamentosUsuario);

// Buscar medicamento por ID (todos autenticados podem acessar)
router.get("/medicamentos/:id", authMiddleware, MedicamentoController.buscarMedicamentoPorId);

// Atualizar medicamento (somente admin ou farmacêutico)
router.put("/medicamentos/:id", authMiddleware, roleMiddleware(["admin", "farmaceutico"]), MedicamentoController.atualizarMedicamento);

// Deletar medicamento (somente admin)
router.delete("/medicamentos/:id", authMiddleware, roleMiddleware(["admin"]), MedicamentoController.deletarMedicamento);

export default router;
