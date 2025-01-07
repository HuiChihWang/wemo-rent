import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1736259163919 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user"
       (
           "id"         SERIAL PRIMARY KEY,
           "name"       varchar(30) NOT NULL,
           "in_rent"    boolean     NOT NULL DEFAULT false,
           "created_at" TIMESTAMP   NOT NULL DEFAULT now(),
           "updated_at" TIMESTAMP   NOT NULL DEFAULT now()
       )`,
    );

    await queryRunner.query(
      `ALTER TABLE "user"
          ADD CONSTRAINT "UQ_user_name" UNIQUE ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
