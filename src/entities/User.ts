import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Medicamento } from "./Medicamento";
import { Role } from "./Role"; // Add this line to import Role

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  nome!: string;

  @Column({ type: "varchar", length: 150, unique: true, nullable: false })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  senha!: string;

  @OneToMany(() => Medicamento, (medicamento) => medicamento.user)
  medicamentos!: Medicamento[];

  roles: Role[] = []; // Inicializado como array vazio para evitar undefined
}

