import { accounts, NotificationChannel } from '@car-qr-link/apis';
import { LinkQrRequest } from '@car-qr-link/apis/dist/accounts';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountsConfig } from 'src/config/accounts.config';

@Injectable()
export class AccountsService {
  protected readonly logger = new Logger(AccountsService.name);

  protected readonly accountsClient: accounts.Client;

  constructor(accountsConfig: AccountsConfig) {
    this.accountsClient = new accounts.Client(accountsConfig.url);
  }

  async getQr(code: string): Promise<accounts.GetQrResponse> {
    return this.accountsClient.getQr(code);
  }

  async linkQr(
    code: string,
    phone: string,
    licensePlate: string,
  ): Promise<void> {
    const request: LinkQrRequest = {
      account: {
        contacts: [
          {
            channel: NotificationChannel.Phone,
            address: phone,
          },
        ],
      },
      qr: {
        licensePlate,
      },
    };

    await this.accountsClient.patchQr(code, request);
  }
}
