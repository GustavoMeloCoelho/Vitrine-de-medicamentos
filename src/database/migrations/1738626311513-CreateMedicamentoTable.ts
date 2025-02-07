
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMedicamentoTable1738626311513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "medicamentos",
        columns: [
          { name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',},
          { name: "nome", type: "varchar", length: "100", isNullable: false },
          { name: "descricao", type: "text", isNullable: true },
          { name: "quantidade", type: "int", isNullable: false },
          { name: "userId", type: "int", isNullable: false },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "medicamentos",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("medicamentos");
  }
}

