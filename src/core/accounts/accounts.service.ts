import { accounts, NotificationChannel } from '@car-qr-link/apis';
import { LinkQrRequest } from '@car-qr-link/apis/dist/accounts';
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
        this.logger.debug(`GET /qrs/${code}`);

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
        if (code === '3') {
            return {
                qr: {
                    id: '3',
                    accountId: '2',
                },
                account: {
                    id: '2',
                    contacts: [{
                        channel: NotificationChannel.Phone,
                        address: process.env.PHONE,
                    }],
                }
            };
        }

        throw new NotFoundException('QR не найден');
    }

    async linkQr(code: string, phone: string, licensePlate: string): Promise<void> {
        const request: LinkQrRequest = {
            account: {
                contacts: [{
                    channel: NotificationChannel.Phone,
                    address: phone,
                }]
            },
            qr: {
                licensePlate
            }
        };
        this.logger.debug(`PATCH /qrs/${code}`, request);
    }
}
