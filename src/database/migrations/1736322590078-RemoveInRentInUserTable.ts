import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveInRentInUserTable1736322590078
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users"
        DROP COLUMN "in_rent"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users"
        ADD COLUMN "in_rent" boolean NOT NULL DEFAULT false`);
  }
}
