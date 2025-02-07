import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"

import { User } from "../entities/User"; 
import { Medicamento } from "../entities/Medicamento";

dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET as string;

console.log("Banco de Dados:", process.env.DB_USERNAME);


export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, Medicamento],
  migrations: ["src/database/migrations/*.ts"]
})
