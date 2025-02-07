import { Request, Response } from "express";
import { Medicamento } from "../entities/Medicamento";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { AuthRequest } from "../middlewares/authMiddleware";
import { ILike } from "typeorm";

const medicamentoRepository = AppDataSource.getRepository(Medicamento);
const userRepository = AppDataSource.getRepository(User);

export class MedicamentoController {
  static createMedicamento = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { nome, descricao, quantidade } = req.body;
      const userId = req.user?.id;
  
      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado" });
        return;
      }
  
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado" });
        return;
      }
  
      const medicamento = medicamentoRepository.create({ nome, descricao, quantidade, user });
      await medicamentoRepository.save(medicamento);
  
      res.status(201).json(medicamento);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar medicamento", error });
    }
  };

  static listarTodosMedicamentos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = "1", limit = "10", nome } = req.query;
  
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const skip = (pageNumber - 1) * limitNumber;
  
      const whereClause = nome ? { nome: ILike(`%${nome}%`) } : {};
  
      const [medicamentos, total] = await medicamentoRepository.findAndCount({
        where: whereClause,
        skip,
        take: limitNumber,
      });
  
      res.json({ total, page: pageNumber, limit: limitNumber, data: medicamentos });
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar medicamentos", error });
    }
  };
  
  static listarMedicamentosUsuario = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado" });
        return;
      }
  
      const { page = "1", limit = "10", nome } = req.query;
  
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
      const skip = (pageNumber - 1) * limitNumber;
  
      const whereClause = nome
        ? { user: { id: userId }, nome: ILike(`%${nome}%`) }
        : { user: { id: userId } };
  
      const [medicamentos, total] = await medicamentoRepository.findAndCount({
        where: whereClause,
        skip,
        take: limitNumber,
      });
  
      res.json({ total, page: pageNumber, limit: limitNumber, data: medicamentos });
    } catch (error) {
      res.status(500).json({ message: "Erro ao listar medicamentos do usuário", error });
    }
  };

  static buscarMedicamentoPorId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const medicamento = await medicamentoRepository.findOne({ 
            where: { id: Number(id) }, 
            relations: ["user"] 
        });

        if (!medicamento) {
            res.status(404).json({ message: "Medicamento não encontrado" });
            return;
        }

        res.json(medicamento);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar medicamento", error });
    }
};

static atualizarMedicamento = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nome, descricao, quantidade } = req.body;
        const userId = req.user?.id;

        const medicamento = await medicamentoRepository.findOne({ 
            where: { id: Number(id) }, 
            relations: ["user"] 
        });

        if (!medicamento) {
            res.status(404).json({ message: "Medicamento não encontrado" });
            return;
        }

        if (medicamento.user.id !== userId) {
            res.status(403).json({ message: "Você não tem permissão para editar este medicamento" });
            return;
        }

        medicamento.nome = nome;
        medicamento.descricao = descricao;
        medicamento.quantidade = quantidade;

        await medicamentoRepository.save(medicamento);
        res.json(medicamento);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar medicamento", error });
    }
};

static deletarMedicamento = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const medicamento = await medicamentoRepository.findOne({ 
            where: { id: Number(id) }, 
            relations: ["user"] 
        });

        if (!medicamento) {
            res.status(404).json({ message: "Medicamento não encontrado" });
            return;
        }

        if (medicamento.user.id !== userId) {
            res.status(403).json({ message: "Você não tem permissão para excluir este medicamento" });
            return;
        }

        await medicamentoRepository.remove(medicamento);
        res.json({ message: "Medicamento removido com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir medicamento", error });
    }
};
}
