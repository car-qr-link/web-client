import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.disable('x-powered-by');
  app.set('trust proxy', true);

  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));

  await app.listen(3000);
}
bootstrap();
