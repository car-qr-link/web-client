import { accounts, NotFoundError, NotificationChannel } from '@car-qr-link/apis';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountsConfig } from 'src/config/accounts.config';

@Injectable()
export class AccountsService {
    protected readonly logger = new Logger(AccountsService.name);

    protected readonly accountsClient: accounts.Client;

    constructor(
        accountsConfig: AccountsConfig,
    ) {
        this.accountsClient = new accounts.Client(accountsConfig.url);
    }

    async getQr(code: string): Promise<accounts.GetQrResponse> {
        if (code === '1') {
            return {
                qr: {
                    id: '1',
                    accountId: null,
                },
                account: null,
            };
        }
        if (code === '2') {
            return {
                qr: {
                    id: '2',
                    accountId: '1',
                },
                account: {
                    id: '1',
                    contacts: [{
                        channel: NotificationChannel.Phone,
                        address: process.env.PHONE,
                    }],
                }
            };
        }

        throw new NotFoundException();
    }
}
