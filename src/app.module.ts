import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './config/configuration.module';
import { UsersModule } from './modules/users/users.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { QuestionnaireModule } from './modules/questionnaire/questionnaire.module';
import { AiModule } from './modules/ai/ai.module';
@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    QuestionnaireModule,
    AiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
