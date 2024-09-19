import { Module } from '@nestjs/common';
import { StorageModule } from './storage/storage.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({


  imports: [StorageModule, AccountsModule]
})
export class CoreModule { }
