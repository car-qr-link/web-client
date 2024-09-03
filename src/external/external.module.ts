import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  providers: [],
  imports: [AccountsModule]
})
export class ExternalModule { }
