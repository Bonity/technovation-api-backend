import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from '../modules/users/entities/user.entity';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvironmentVariables } from '../constants/enviromentVariables';
import { UserAuthentication } from '../modules/authentication/entities/userAuthentication.entity';

// Load environment variables based on NODE_ENV
const envFile = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`;
config({ path: envFile });

export const databaseOrmOptions: TypeOrmModuleOptions | DataSourceOptions = {
  type: 'postgres',
  host: process.env[EnvironmentVariables.DATABASE_HOST] || 'localhost',
  port: parseInt(process.env[EnvironmentVariables.DATABASE_PORT] || '5432', 10),
  username: process.env[EnvironmentVariables.DATABASE_USERNAME] || 'postgres',
  password: process.env[EnvironmentVariables.DATABASE_PASSWORD] || '',
  database: process.env[EnvironmentVariables.DATABASE_NAME] || 'technovation',
  entities: [User, UserAuthentication],
  migrations: [join(__dirname, './migrations/*{.ts,.js}')],
  synchronize: false,
  migrationsRun: false,
  logging: process.env[EnvironmentVariables.DATABASE_LOGGING] === 'true',
};

export const databaseOrmMigrationOptions: TypeOrmModuleOptions = {
  ...databaseOrmOptions,
  migrationsTableName: 'migrations',
};

export default new DataSource(databaseOrmMigrationOptions as DataSourceOptions);
