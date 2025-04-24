import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedQuestionnaire1745453537706 implements MigrationInterface {
    name = 'AddedQuestionnaire1745453537706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "questionnaires" ("id" SERIAL NOT NULL, "answers" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a01d7cdea895ed9796b29233610" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "questionnaires"`);
    }

}
