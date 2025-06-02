import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateFavoritesTable1748826640357 implements MigrationInterface {
  name = "CreateFavoritesTable1748826640357";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`CREATE TABLE "favorites" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "clientId" uuid NOT NULL,
            "productId" integer NOT NULL,
            CONSTRAINT "UQ_FAVORITE_CLIENT_PRODUCT" UNIQUE ("clientId", "productId"),
            CONSTRAINT "PK_FAVORITES_ID" PRIMARY KEY ("id")
        )`);

    await queryRunner.createForeignKey(
      "favorites",
      new TableForeignKey({
        name: "FK_Favorites_Client",
        columnNames: ["clientId"],
        referencedTableName: "clients",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("favorites");
    const foreignKey = table?.foreignKeys.find(
      (fk) =>
        fk.columnNames.indexOf("clientId") !== -1 &&
        fk.referencedTableName === "clients"
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey("favorites", foreignKey);
    }
    await queryRunner.query(`DROP TABLE "favorites"`);
  }
}
