import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AccountsConfig } from './accounts.config';
import { MessagingConfig } from './messaging.config';
import { NotificationsConfig } from './notifications.config';
import { StorageConfig } from './storage.config';

@Module({
    imports: [NestConfigModule.forRoot()],
    providers: [AccountsConfig, StorageConfig, MessagingConfig, NotificationsConfig],
    exports: [AccountsConfig, StorageConfig, MessagingConfig, NotificationsConfig],
})
export class ConfigModule { }
