import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScooterTable1736259243606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scooters"
       (
           "id"         SERIAL PRIMARY KEY,
           "scooter_no" varchar(20) NOT NULL,
           "status"     varchar(20) NOT NULL,
           "type"       varchar(20),
           "created_at" TIMESTAMP   NOT NULL DEFAULT now(),
           "updated_at" TIMESTAMP   NOT NULL DEFAULT now()
       )`,
    );

    await queryRunner.query(
      `ALTER TABLE "scooters"
          ADD CONSTRAINT "UQ_scooter_scooter_no" UNIQUE ("scooter_no")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "scooters"`);
  }
}
