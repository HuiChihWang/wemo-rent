import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRentingHistoryTable1736259514642
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "renting_histories"
       (
           "id"         SERIAL PRIMARY KEY,
           "scooter_id" integer     NOT NULL,
           "user_id"    integer     NOT NULL,
           "status"     varchar(10) NOT NULL,
           "start_time" TIMESTAMP   NOT NULL,
           "end_time"   TIMESTAMP,
           "created_at" TIMESTAMP   NOT NULL DEFAULT now(),
           "updated_at" TIMESTAMP   NOT NULL DEFAULT now()
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "renting_histories"`);
  }
}
