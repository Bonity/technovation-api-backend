import { Module } from "@nestjs/common";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { QuestionnaireModule } from "../questionnaire/questionnaire.module";

@Module({
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
  imports: [QuestionnaireModule]
})
export class AiModule {}

