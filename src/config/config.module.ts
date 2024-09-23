import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AccountsConfig } from './accounts.config';
import { CaptchaConfig } from './captcha.config';
import { MessagingConfig } from './messaging.config';
import { NotificationsConfig } from './notifications.config';
import { StorageConfig } from './storage.config';

@Module({
    imports: [NestConfigModule.forRoot()],
    providers: [
        AccountsConfig,
        StorageConfig,
        MessagingConfig,
        NotificationsConfig,
        CaptchaConfig
    ],
    exports: [
        AccountsConfig,
        StorageConfig,
        MessagingConfig,
        NotificationsConfig,
        CaptchaConfig
    ],
})
export class ConfigModule { }
