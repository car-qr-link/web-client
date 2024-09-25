import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StorageModule } from './storage/storage.module';
import { CaptchaModule } from './captcha/captcha.module';
import { VerificationModule } from './verification/verification.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    StorageModule,
    AccountsModule,
    MessagingModule,
    NotificationsModule,
    CaptchaModule,
    VerificationModule,
    OrdersModule,
  ],
})
export class CoreModule {}
