import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTimesheetTable1562025927373 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "timesheet" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "hours" integer NOT NULL, "observations" character varying(500) NOT NULL, "projectId" integer, "userId" integer, CONSTRAINT "PK_53c30fa094ae81f166955fb1036" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD CONSTRAINT "FK_ac58894ff3ba9e26707b7528ecd" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "timesheet" ADD CONSTRAINT "FK_689d5a0fd3a37c30aab320afd8e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_689d5a0fd3a37c30aab320afd8e"`);
    await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_ac58894ff3ba9e26707b7528ecd"`);
    await queryRunner.query(`DROP TABLE "timesheet"`);
  }
}
