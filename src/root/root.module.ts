import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/core/accounts/accounts.module';
import { MessagingModule } from 'src/core/messaging/messaging.module';
import { NotificationsModule } from 'src/core/notifications/notifications.module';
import { RootController } from './root.controller';
import { CaptchaModule } from 'src/core/captcha/captcha.module';
import { VerificationModule } from 'src/core/verification/verification.module';

@Module({
  imports: [
    AccountsModule,
    NotificationsModule,
    MessagingModule,
    CaptchaModule,
    VerificationModule,
  ],
  controllers: [RootController]
})
export class RootModule { }
