import { Module } from '@nestjs/common';
import { CaptchaModule } from 'src/core/captcha/captcha.module';
import { OrderController } from './order.controller';

@Module({
  imports: [CaptchaModule],
  controllers: [OrderController],
})
export class OrderModule {}
