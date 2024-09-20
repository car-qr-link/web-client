import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [StorageModule, AccountsModule, MessagingModule, NotificationsModule]
})
export class CoreModule { }
