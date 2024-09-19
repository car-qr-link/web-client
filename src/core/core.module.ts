import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import { AccountsModule } from './accounts/accounts.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [StorageModule, AccountsModule, MessagingModule]
})
export class CoreModule { }
