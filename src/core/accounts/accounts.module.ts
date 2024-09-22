import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { MessagingModule } from '../messaging/messaging.module';
import { StorageModule } from '../storage/storage.module';
import { AccountsService } from './accounts.service';

@Module({
  imports: [ConfigModule, MessagingModule, StorageModule],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule { }
