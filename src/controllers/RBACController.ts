import { Request, Response } from "express";
import { Permission } from "../entities/Permission";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { AppDataSource } from "../database/data-source";

export class RBACController {
  private static permissionRepository = AppDataSource.getRepository(Permission);
  private static roleRepository = AppDataSource.getRepository(Role);
  private static userRepository = AppDataSource.getRepository(User);

  // 🟢 Listar todas as permissões
  static async listPermissions(req: Request, res: Response): Promise<void> {
    try {
      const permissions = await this.permissionRepository.find();
      res.json(permissions);
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar permissões", error });
    }
  }

  // 🟢 Criar uma nova permissão
  static async createOnePermission(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ message: "O nome da permissão é obrigatório" });
        return;
      }

      const newPermission = this.permissionRepository.create({ name });
      await this.permissionRepository.save(newPermission);
      res.status(201).json(newPermission);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar permissão", error });
    }
  }

  // 🟢 Listar todas as roles (funções)
  static async listRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.roleRepository.find({ relations: ["permissions"] });
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar roles", error });
    }
  }

  // 🟢 Criar uma nova role
  static async createOneRole(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ message: "O nome da role é obrigatório" });
        return;
      }

      const newRole = this.roleRepository.create({ name });
      await this.roleRepository.save(newRole);
      res.status(201).json(newRole);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar role", error });
    }
  }

  // 🟢 Listar permissões de uma role específica
  static async listPermissionsByRole(req: Request, res: Response): Promise<void> {
    try {
      const { roleId } = req.params;
      const role = await this.roleRepository.findOne({
        where: { id: Number(roleId) },
        relations: ["permissions"],
      });

      if (!role) {
        res.status(404).json({ message: "Role não encontrada" });
        return;
      }

      res.json(role.permissions);
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar permissões da role", error });
    }
  }

  // 🟢 Adicionar permissão a uma role
  static async addPermissionToRole(req: Request, res: Response): Promise<void> {
    try {
      const { roleId, permissionId } = req.body;

      const role = await this.roleRepository.findOne({
        where: { id: Number(roleId) },
        relations: ["permissions"],
      });
      const permission = await this.permissionRepository.findOne({ where: { id: Number(permissionId) } });

      if (!role || !permission) {
        res.status(404).json({ message: "Role ou Permissão não encontrada" });
        return;
      }

      role.permissions.push(permission);
      await this.roleRepository.save(role);

      res.json({ message: "Permissão adicionada à role com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar permissão à role", error });
    }
  }

  // 🟢 Adicionar uma role a um usuário
  static async addRoleToUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId, roleId } = req.body;

      const user = await this.userRepository.findOne({
        where: { id: Number(userId) },
        relations: ["roles"],
      });
      const role = await this.roleRepository.findOne({ where: { id: Number(roleId) } });

      if (!user || !role) {
        res.status(404).json({ message: "Usuário ou Role não encontrada" });
        return;
      }

      user.roles.push(role);
      await this.userRepository.save(user);

      res.json({ message: "Role adicionada ao usuário com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao adicionar role ao usuário", error });
    }
  }
}
