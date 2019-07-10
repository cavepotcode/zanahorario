import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTimesheetColumns1562707095662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_ac58894ff3ba9e26707b7528ecd"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_689d5a0fd3a37c30aab320afd8e"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "projectId"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "observations"`);
    await queryRunner.query(`ALTER TABLE "timesheet" ADD "project_id" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "timesheet" ADD "user_id" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "timesheet" ALTER COLUMN "hours" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD CONSTRAINT "FK_31efc1af34b3e429cf9bde584e2" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD CONSTRAINT "FK_f1982fcf8ecb489419062b10d45" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_f1982fcf8ecb489419062b10d45"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_31efc1af34b3e429cf9bde584e2"`);
    await queryRunner.query(`ALTER TABLE "timesheet" ALTER COLUMN "hours" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP COLUMN "project_id"`);
    await queryRunner.query(`ALTER TABLE "timesheet" ADD "observations" character varying(500) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "timesheet" ADD "userId" integer`);
    await queryRunner.query(`ALTER TABLE "timesheet" ADD "projectId" integer`);
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD CONSTRAINT "FK_689d5a0fd3a37c30aab320afd8e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD CONSTRAINT "FK_ac58894ff3ba9e26707b7528ecd" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
