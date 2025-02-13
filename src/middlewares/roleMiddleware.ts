import { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories/UserRepository";
import { AuthRequest } from "../middlewares/authMiddleware"; // Middleware de autenticação deve definir AuthRequest

export const roleMiddleware = (rolesPermitidas: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado" });
        return;
      }

      // Busca o usuário no banco e carrega as roles associadas
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["roles"],
      });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }

      // Extrai as roles do usuário
      const rolesDoUsuario = user.roles.map(role => role.name);

      // Verifica se o usuário tem pelo menos uma das roles permitidas
      const temPermissao = rolesPermitidas.some(role => rolesDoUsuario.includes(role));

      if (!temPermissao) {
        res.status(403).json({ message: "Acesso negado. Permissão insuficiente." });
        return;
      }

      next(); // Usuário tem permissão, segue para a próxima função
    } catch (error) {
      res.status(500).json({ message: "Erro ao validar permissões", error });
    }
  };
};
