import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ApiModule } from './api/api.module';
import { ConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
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
    CoreModule,
    ApiModule,
    RootModule,
  ],
})
export class AppModule { }
