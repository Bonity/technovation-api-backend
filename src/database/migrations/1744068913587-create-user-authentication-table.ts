import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAuthenticationTable1744068913587
  implements MigrationInterface
{
  name = 'CreateUserAuthenticationTable1744068913587';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_authentications" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "auth_token" character varying NOT NULL, "refresh_token" character varying NOT NULL, "browser_agent" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_5357fb1162b50b926c77290c8bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" ADD CONSTRAINT "FK_163ff5c9a502621798f57606e80" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_authentications" DROP CONSTRAINT "FK_163ff5c9a502621798f57606e80"`,
    );
    await queryRunner.query(`DROP TABLE "user_authentications"`);
  }
}
