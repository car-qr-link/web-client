import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import { StorageModule } from '../storage/storage.module';
import { VerificationService } from './verification.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule, MessagingModule, StorageModule],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule { }
