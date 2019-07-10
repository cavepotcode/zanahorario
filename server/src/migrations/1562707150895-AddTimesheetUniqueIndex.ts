import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimesheetUniqueIndex1562707150895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_35cb7e0a4da95af054cdd0b212" ON "timesheet" ("date", "project_id", "user_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_35cb7e0a4da95af054cdd0b212"`);
  }
}
