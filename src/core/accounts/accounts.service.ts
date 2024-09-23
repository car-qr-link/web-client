import { accounts, NotificationChannel } from '@car-qr-link/apis';
import { LinkQrRequest } from '@car-qr-link/apis/dist/accounts';
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountsConfig } from 'src/config/accounts.config';
import { VerificationService } from '../verification/verification.service';
import { VerifyRequestPayload } from './accounts.model';

@Injectable()
export class AccountsService {
    protected readonly logger = new Logger(AccountsService.name);

    protected readonly accountsClient: accounts.Client;

    constructor(
        accountsConfig: AccountsConfig,
        private readonly verificationService: VerificationService,
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

    async linkQrPrepare(code: string, phone: string, licensePlate: string) {
        const result = await this.getQr(code);
        if (result.account) {
            throw new ConflictException('QR уже привязан');
        }

        const requestId = await this.verificationService.sendCode<VerifyRequestPayload>(
            NotificationChannel.Phone,
            phone,
            {
                phone: phone,
                licensePlate: licensePlate,
                code: code,
            }
        );

        return {
            verification: {
                id: requestId,
            }
        };
    }

    async linkQrConfirm(requestId: string, confirmCode: string) {
        const result = await this.verificationService.verifyCode<VerifyRequestPayload>(
            requestId,
            confirmCode
        );

        await this.linkQr(
            result.code,
            result.phone,
            result.licensePlate
        );
    }
}
