import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("medicamentos") // Nome da tabela no banco
export class Medicamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, nullable: false })
  nome!: string;

  @Column({ type: "text", nullable: true })
  descricao?: string;

  @Column({ type: "int", nullable: false })
  quantidade!: number;

  @ManyToOne(() => User, (user) => user.medicamentos, { onDelete: "CASCADE" })
  user!: User;
}
