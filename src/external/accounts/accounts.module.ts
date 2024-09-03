import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import accountsConfig from 'src/config/accounts.config';

@Module({
  imports: [
    ConfigModule.forFeature(accountsConfig),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('url')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule { }
