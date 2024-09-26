import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { dataSourceOptions } from './db';
import { RootModule } from './root/root.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        // install 'pino-pretty' package in order to use the following option
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () =>
        ({
          ...dataSourceOptions,
          type: new URL(
            process.env.DATABASE__URL || dataSourceOptions.url,
          ).protocol.replaceAll(':', ''),
          url: process.env.DATABASE__URL,

          synchronize: process.env.NODE_ENV !== 'production',
          migrationsRun: process.env.NODE_ENV === 'production',
        }) as unknown as DataSourceOptions,
    }),
    CoreModule,
    RootModule,
  ],
})
export class AppModule {}
