import { Module } from '@nestjs/common';
import { CaptchaModule } from 'src/core/captcha/captcha.module';
import { OrderController } from './order.controller';
import { OrdersModule } from 'src/core/orders/orders.module';

@Module({
  imports: [CaptchaModule, OrdersModule],
  controllers: [OrderController],
})
export class OrderModule {}
