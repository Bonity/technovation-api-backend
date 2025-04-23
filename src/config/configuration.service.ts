import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  databaseOrmOptions,
  databaseOrmMigrationOptions,
} from '../database/databaseOrmOptions';

@Injectable()
export class ConfigurationService {
  constructor(private configService: NestConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get nodeEnv(): string {
    return this.configService.get('NODE_ENV') || 'development';
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    // Simply return the pre-configured database options
    return databaseOrmOptions;
  }

  // Separate config for CLI migration commands
  get typeOrmMigrationConfig(): TypeOrmModuleOptions {
    return databaseOrmMigrationOptions;
  }
}
