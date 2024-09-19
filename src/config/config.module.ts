import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AccountsConfig } from './accounts.config';
import { StorageConfig } from './storage.config';

@Module({
    imports: [NestConfigModule.forRoot({

    })],
    providers: [AccountsConfig, StorageConfig],
    exports: [AccountsConfig, StorageConfig],
})
export class ConfigModule { }
