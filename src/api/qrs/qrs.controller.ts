import { NotificationChannel } from '@car-qr-link/apis';
import { BadRequestException, Body, ConflictException, Controller, Get, Logger, Param, Patch } from '@nestjs/common';
import { randomBytes, randomInt } from 'crypto';
import { parsePhoneNumber } from 'libphonenumber-js';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { MessagingService } from 'src/core/messaging/messaging.service';
import { StorageService } from 'src/core/storage/storage.service';
import { LinkRequest, LinkResponse } from './qrs.dto';

@Controller('api/qrs')
export class QrsController {
    protected readonly logger = new Logger(QrsController.name);

    constructor(
        protected readonly accountsService: AccountsService,
        protected readonly storageService: StorageService,
        protected readonly messagingService: MessagingService
    ) { }

    @Get(':code')
    async get(@Param('code') code: string) {
        const result = await this.accountsService.getQr(code);

        return {
            id: result.qr.id,
            hasAccount: result.qr.accountId !== null,
        };
    }

    @Patch(':code/link')
    async update(
        @Param('code') code: string,
        @Body() body: LinkRequest
    ): Promise<LinkResponse> {
        const result = await this.accountsService.getQr(code);
        if (result.account) {
            throw new ConflictException('QR уже привязан');
        }

        const phoneNumber = parsePhoneNumber(body.phone, 'RU')?.format('E.164');
        if (!phoneNumber) {
            throw new BadRequestException('Некорректный формат номера телефона');
        }

        const requestId = randomBytes(18).toString('hex');
        const confirmCode = randomInt(10000, 99999).toString();

        await this.storageService.saveVerifyRequest(
            requestId,
            {
                channel: NotificationChannel.Phone,
                address: phoneNumber,
                code: confirmCode,
            }
        );

        await this.messagingService.send(
            NotificationChannel.Phone,
            phoneNumber,
            `${confirmCode} - код подтверждения Мешает.рф`
        );

        return {
            requestId
        };
    }
}
