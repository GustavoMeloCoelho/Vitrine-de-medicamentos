import { Router } from "express";
import { RBACController } from "../controllers/RBACController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/permissions", authMiddleware, RBACController.listPermissions);
router.post("/permissions", authMiddleware, RBACController.createOnePermission);
 
router.get("/roles", authMiddleware, RBACController.listRoles);
router.post("/roles", authMiddleware, RBACController.createOneRole);

router.get("/roles/:id/permissions", authMiddleware, RBACController.listPermissionsByRole);
router.post("/roles/:id/permissions", authMiddleware, RBACController.addPermissionToRole);

router.post("/users/:id/roles", authMiddleware, RBACController.addRoleToUser);

export default router;
