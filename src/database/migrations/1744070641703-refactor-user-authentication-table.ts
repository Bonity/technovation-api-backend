import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorUserAuthenticationTable1744070641703
  implements MigrationInterface
{
  name = 'RefactorUserAuthenticationTable1744070641703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_authentications" DROP COLUMN "expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" ADD "auth_expires_at" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" ADD "refresh_expires_at" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" ADD "token_family" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" ADD "is_revoked" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_authentications" DROP COLUMN "is_revoked"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" DROP COLUMN "token_family"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" DROP COLUMN "refresh_expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" DROP COLUMN "auth_expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_authentications" ADD "expires_at" TIMESTAMP NOT NULL`,
    );
  }
}
