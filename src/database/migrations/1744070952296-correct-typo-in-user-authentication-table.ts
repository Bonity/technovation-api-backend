import { MigrationInterface, QueryRunner } from 'typeorm';

export class CorrectTypoInUserAuthenticationTable1744070952296
  implements MigrationInterface
{
  name = 'CorrectTypoInUserAuthenticationTable1744070952296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_authentications" DROP COLUMN "token_family"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_authentications" ADD "token_family" character varying`,
    );
  }
}
