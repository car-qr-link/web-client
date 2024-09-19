import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { MessagingService } from './messaging.service';

@Module({
  imports: [ConfigModule],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule { }
