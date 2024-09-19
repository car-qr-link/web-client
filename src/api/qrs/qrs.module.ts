import { Module } from '@nestjs/common';
import { QrsController } from './qrs.controller';
import { ConfigModule } from 'src/config/config.module';
import { AccountsModule } from 'src/core/accounts/accounts.module';
import { StorageModule } from 'src/core/storage/storage.module';

@Module({
  imports: [AccountsModule, StorageModule],
  controllers: [QrsController],
})
export class QrsModule { }
