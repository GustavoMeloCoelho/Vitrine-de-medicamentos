import { RequestHandler, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../database/data-source"; 

import dotenv from "dotenv";

dotenv.config();

export class UserController {
  
  // Cadastro de usuário
  static createUser: RequestHandler = async (req, res) => {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        res.status(400).json({ error: "Todos os campos são obrigatórios." });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const userExists = await userRepository.findOne({ where: { email } });

      if (userExists) {
        res.status(400).json({ error: "Email já cadastrado." });
        return;
      }

      const hashedPassword = await bcryptjs.hash(senha, 10);
      const newUser = userRepository.create({ nome, email, senha: hashedPassword });

      await userRepository.save(newUser);

      res.status(201).json({ message: "Usuário criado com sucesso." });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

  // Login de usuário
  static login: RequestHandler = async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.status(400).json({ error: "Email e senha são obrigatórios." });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        res.status(401).json({ error: "Credenciais inválidas." });
        return;
      }

      const isPasswordValid = await bcryptjs.compare(senha, user.senha);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Credenciais inválidas." });
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "2h",
      });

      res.status(200).json({ message: "Login bem-sucedido.", token });
    } catch (error) {
      console.error("Erro ao autenticar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

  static getAllUsers: RequestHandler = async (_req, res) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();
      res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  };

}


