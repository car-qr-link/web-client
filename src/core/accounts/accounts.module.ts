import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule { }
