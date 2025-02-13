
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRBAC1739399375677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela de roles
    await queryRunner.createTable(
      new Table({
        name: "roles",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", isUnique: true },
          { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      })
    );

    // Criar tabela de permissions
    await queryRunner.createTable(
      new Table({
        name: "permissions",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", isUnique: true },
          { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      })
    );

    // Criar tabela intermediária role_permissions
    await queryRunner.createTable(
      new Table({
        name: "role_permissions",
        columns: [
          { name: "role_id", type: "int", isPrimary: true },
          { name: "permission_id", type: "int", isPrimary: true },
        ],
      })
    );

    // Criar tabela intermediária user_roles
    await queryRunner.createTable(
      new Table({
        name: "user_roles",
        columns: [
          { name: "user_id", type: "int", isPrimary: true },
          { name: "role_id", type: "int", isPrimary: true },
        ],
      })
    );

    // Adicionar chaves estrangeiras
    await queryRunner.createForeignKeys("role_permissions", [
      new TableForeignKey({ columnNames: ["role_id"], referencedColumnNames: ["id"], referencedTableName: "roles", onDelete: "CASCADE" }),
      new TableForeignKey({ columnNames: ["permission_id"], referencedColumnNames: ["id"], referencedTableName: "permissions", onDelete: "CASCADE" }),
    ]);

    await queryRunner.createForeignKeys("user_roles", [
      new TableForeignKey({ columnNames: ["user_id"], referencedColumnNames: ["id"], referencedTableName: "users", onDelete: "CASCADE" }),
      new TableForeignKey({ columnNames: ["role_id"], referencedColumnNames: ["id"], referencedTableName: "roles", onDelete: "CASCADE" }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_roles");
    await queryRunner.dropTable("role_permissions");
    await queryRunner.dropTable("permissions");
    await queryRunner.dropTable("roles");
  }
}
