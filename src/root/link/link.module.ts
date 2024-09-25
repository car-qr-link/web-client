import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/core/accounts/accounts.module';
import { CaptchaModule } from 'src/core/captcha/captcha.module';
import { VerificationModule } from 'src/core/verification/verification.module';
import { LinkController } from './link.controller';

@Module({
  imports: [AccountsModule, CaptchaModule, VerificationModule],
  controllers: [LinkController],
})
export class LinkModule {}
