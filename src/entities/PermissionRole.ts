import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Role } from "./Role";
import { Permission } from "./Permission";

@Entity("role_permissions")
export class PermissionRole {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Role, (role) => role.permissions)
  role!: Role;

  @ManyToOne(() => Permission, (permission) => permission.roles)
  permission!: Permission;
}
