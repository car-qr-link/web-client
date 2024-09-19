import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/core/accounts/accounts.module';
import { MessagingModule } from 'src/core/messaging/messaging.module';
import { StorageModule } from 'src/core/storage/storage.module';
import { QrsController } from './qrs.controller';

@Module({
  imports: [AccountsModule, StorageModule, MessagingModule],
  controllers: [QrsController],
})
export class QrsModule { }
