import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/core/accounts/accounts.module';
import { CaptchaModule } from 'src/core/captcha/captcha.module';
import { NotificationsModule } from 'src/core/notifications/notifications.module';
import { QrController } from './qr.controller';

@Module({
  imports: [AccountsModule, NotificationsModule, CaptchaModule],
  controllers: [QrController],
})
export class QrModule {}
