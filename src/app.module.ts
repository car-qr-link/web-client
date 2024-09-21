import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ApiModule } from './api/api.module';
import { AppController } from './app/app.controller';
import { ConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';

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
  ],
  controllers: [AppController],
})
export class AppModule { }
