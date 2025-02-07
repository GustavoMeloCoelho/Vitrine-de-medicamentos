import { Router } from "express";
import { MedicamentoController } from "../controllers/MedicamentoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/medicamentos", authMiddleware, MedicamentoController.createMedicamento);
router.get("/medicamentos/all", MedicamentoController.listarTodosMedicamentos);
router.get("/medicamentos", authMiddleware, MedicamentoController.listarMedicamentosUsuario);
router.get("/medicamentos/:id", authMiddleware, MedicamentoController.buscarMedicamentoPorId);
router.put("/medicamentos/:id", authMiddleware, MedicamentoController.atualizarMedicamento);
router.delete("/medicamentos/:id", authMiddleware, MedicamentoController.deletarMedicamento);

export default router;

