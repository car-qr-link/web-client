import { accounts, NotificationChannel } from '@car-qr-link/apis';
import { LinkQrRequest } from '@car-qr-link/apis/dist/accounts';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomBytes, randomInt } from 'crypto';
import { parsePhoneNumber } from 'libphonenumber-js';
import { AccountsConfig } from 'src/config/accounts.config';
import { MessagingService } from '../messaging/messaging.service';
import { StorageService } from '../storage/storage.service';
import { VerifyRequestPayload } from './accounts.dto';

@Injectable()
export class AccountsService {
    protected readonly logger = new Logger(AccountsService.name);

    protected readonly accountsClient: accounts.Client;

    constructor(
        accountsConfig: AccountsConfig,
        private readonly messagingService: MessagingService,
        private readonly storageService: StorageService
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

        const phoneNumber = parsePhoneNumber(phone, 'RU')?.format('E.164');
        if (!phoneNumber) {
            throw new BadRequestException('Некорректный формат номера телефона');
        }

        const requestId = randomBytes(18).toString('hex');
        const confirmCode = randomInt(10000, 99999).toString();

        await this.storageService.saveVerifyRequest<VerifyRequestPayload>(
            requestId,
            {
                channel: NotificationChannel.Phone,
                address: phoneNumber,
                code: confirmCode,
                payload: {
                    code,
                    phone,
                    licensePlate,
                },
            }
        );

        await this.messagingService.send(
            NotificationChannel.Phone,
            phoneNumber,
            `${confirmCode} - код подтверждения Мешает.рф`
        );

        return {
            verification: {
                id: requestId,
            }
        };
    }

    async linkQrConfirm(requestId: string, confirmCode: string) {
        const result = await this.storageService.getVerifyRequest<VerifyRequestPayload>(requestId);
        if (!result) {
            throw new BadRequestException('Некорректный ИД запроса');
        }

        if (result.code !== confirmCode) {
            throw new BadRequestException('Неверный код подтверждения');
        }

        await this.linkQr(
            result.payload.code,
            result.payload.phone,
            result.payload.licensePlate
        );
    }
}
