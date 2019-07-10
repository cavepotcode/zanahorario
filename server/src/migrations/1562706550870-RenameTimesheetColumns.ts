import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTimesheetColumns1562706550870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_689d5a0fd3a37c30aab320afd8e"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "timesheet" ADD "project_id" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "timesheet" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD CONSTRAINT "FK_f1982fcf8ecb489419062b10d45" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_f1982fcf8ecb489419062b10d45"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "project_id"`);
    await queryRunner.query(`ALTER TABLE "timesheet" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD CONSTRAINT "FK_689d5a0fd3a37c30aab320afd8e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
