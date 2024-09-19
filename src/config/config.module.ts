import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AccountsConfig } from './accounts.config';
import { MessagingConfig } from './messaging.config';
import { StorageConfig } from './storage.config';

@Module({
    imports: [NestConfigModule.forRoot({

    })],
    providers: [AccountsConfig, StorageConfig, MessagingConfig],
    exports: [AccountsConfig, StorageConfig, MessagingConfig],
})
export class ConfigModule { }
