import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Permission } from "./Permission";
import { User } from "./User";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id!: number; // ID sempre existirá pois é gerado automaticamente

  @Column({ unique: true })
  name!: string; // Name deve ser obrigatório

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissions: Permission[] = []; // Inicializado como array vazio para evitar undefined

  @ManyToMany(() => User)
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  })
  users: User[] = []; // Inicializado como array vazio para evitar undefined
}
