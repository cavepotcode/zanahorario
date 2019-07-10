import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectTable1562011478652 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" character varying(500) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "project"`);
  }
}
