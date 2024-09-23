import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AccountsConfig } from './accounts.config';
import { CaptchaConfig } from './captcha.config';
import { MessagingConfig } from './messaging.config';
import { NotificationsConfig } from './notifications.config';
import { StorageConfig } from './storage.config';
import { VerificationConfig } from './verification.config';

@Module({
    imports: [NestConfigModule.forRoot()],
    providers: [
        AccountsConfig,
        StorageConfig,
        MessagingConfig,
        NotificationsConfig,
        CaptchaConfig,
        VerificationConfig,
    ],
    exports: [
        AccountsConfig,
        StorageConfig,
        MessagingConfig,
        NotificationsConfig,
        CaptchaConfig,
        VerificationConfig,
    ],
})
export class ConfigModule { }
