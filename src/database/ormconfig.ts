import { DataSource } from 'typeorm';
import { databaseOrmMigrationOptions } from './databaseOrmOptions';

export default new DataSource({
  ...databaseOrmMigrationOptions,
  type: 'postgres',
} as any);
