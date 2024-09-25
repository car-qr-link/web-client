import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/core/accounts/accounts.module';
import { CaptchaModule } from 'src/core/captcha/captcha.module';
import { NotificationsModule } from 'src/core/notifications/notifications.module';
import { LinkModule } from './link/link.module';
import { OrderModule } from './order/order.module';
import { RootController } from './root.controller';

@Module({
  imports: [
    AccountsModule,
    NotificationsModule,
    CaptchaModule,
    //
    LinkModule,
    OrderModule,
  ],
  controllers: [RootController],
})
export class RootModule {}
