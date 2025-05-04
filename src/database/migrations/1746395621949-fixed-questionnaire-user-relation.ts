import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedQuestionnaireUserRelation1746395621949 implements MigrationInterface {
    name = 'FixedQuestionnaireUserRelation1746395621949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questionnaires" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "questionnaires" ADD CONSTRAINT "UQ_4b9f7ce692f6b179b548fde6b3c" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "questionnaires" ADD CONSTRAINT "FK_4b9f7ce692f6b179b548fde6b3c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questionnaires" DROP CONSTRAINT "FK_4b9f7ce692f6b179b548fde6b3c"`);
        await queryRunner.query(`ALTER TABLE "questionnaires" DROP CONSTRAINT "UQ_4b9f7ce692f6b179b548fde6b3c"`);
        await queryRunner.query(`ALTER TABLE "questionnaires" DROP COLUMN "user_id"`);
    }

}
