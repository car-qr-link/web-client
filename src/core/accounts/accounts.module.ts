import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { VerificationModule } from '../verification/verification.module';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    ConfigModule,
    VerificationModule,
  ],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule { }
