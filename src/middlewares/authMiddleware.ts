import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../database/data-source"; 

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  console.log("Middleware de autenticação chamado!");

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Formato do token inválido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    req.user = { id: decoded.id }; 

    console.log("Usuário autenticado:", req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};
