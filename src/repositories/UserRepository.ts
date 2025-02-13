import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";

// Criamos e exportamos o repositório de usuários, para ser usado em toda a aplicação
export const userRepository = AppDataSource.getRepository(User);
