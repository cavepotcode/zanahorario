import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1560785658557 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "password" character varying(150) NOT NULL, "email" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "active" boolean NOT NULL DEFAULT true, "color" character varying(20), "initials" character varying(10), "name" character varying(20), "photo" character varying(50), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
