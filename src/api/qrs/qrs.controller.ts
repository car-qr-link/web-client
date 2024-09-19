import { accounts, NotificationChannel } from '@car-qr-link/apis';
import { BadRequestException, Body, ConflictException, Controller, Get, Logger, Param, Patch } from '@nestjs/common';
import { AccountsConfig } from 'src/config/accounts.config';
import { LinkRequest, LinkResponse } from './qrs.dto';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { parsePhoneNumber } from 'libphonenumber-js';
import { randomBytes, randomInt } from 'crypto';
import { StorageService } from 'src/core/storage/storage.service';

@Controller('api/qrs')
export class QrsController {
    protected readonly logger = new Logger(QrsController.name);

    constructor(
        protected readonly accountsService: AccountsService,
        protected readonly storageService: StorageService
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

        const phoneNumber = parsePhoneNumber(body.phone, 'RU');
        if (!phoneNumber) {
            throw new BadRequestException('Некорректный формат номера телефона');
        }

        const requestId = randomBytes(18).toString('hex');
        const confirmCode = randomInt(10000, 99999).toString();

        await this.storageService.saveVerifyRequest(
            requestId,
            {
                channel: NotificationChannel.Phone,
                address: phoneNumber.format('E.164'),
                code: confirmCode,
            }
        );

        return {
            requestId
        };
    }
}
