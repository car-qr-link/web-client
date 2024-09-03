import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExternalModule } from './external/external.module';
import { AccountsModule } from './external/accounts/accounts.module';

@Module({
  imports: [ExternalModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
