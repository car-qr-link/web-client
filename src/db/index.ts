import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions = {
  type: 'mariadb',
  url:
    process.env.DATABASE__URL ||
    'mariadb://web-client:web-client@mariadb:3306/web-client',

  synchronize: process.env.NODE_ENV !== 'production',
  migrationsRun: process.env.NODE_ENV === 'production',

  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
};

const dataSource = new DataSource(
  dataSourceOptions as unknown as DataSourceOptions,
);

export default dataSource;
