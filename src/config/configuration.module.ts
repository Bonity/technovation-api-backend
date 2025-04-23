import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigurationService } from './configuration.service';
import { EnvironmentVariables } from 'src/constants/enviromentVariables';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env[EnvironmentVariables.NODE_ENV] ? `.${process.env[EnvironmentVariables.NODE_ENV]}` : ''}`,
    }),
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
