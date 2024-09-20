import { NotificationChannel } from '@car-qr-link/apis';
import { BadRequestException, Body, ConflictException, Controller, Get, HttpCode, Logger, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { randomBytes, randomInt } from 'crypto';
import { parsePhoneNumber } from 'libphonenumber-js';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { MessagingService } from 'src/core/messaging/messaging.service';
import { NotificationsService } from 'src/core/notifications/notifications.service';
import { StorageService } from 'src/core/storage/storage.service';
import { EXAMPLES, TAG_QR } from 'src/swagger';
import { GetResponse, LinkConfirmRequest, LinkRequest, LinkResponse, NotifyRequest, NotifyResponse, VerifyRequestPayload } from './qrs.dto';

@Controller('api/qrs')
@ApiTags(TAG_QR)
export class QrsController {
    protected readonly logger = new Logger(QrsController.name);

    constructor(
        protected readonly accountsService: AccountsService,
        protected readonly storageService: StorageService,
        protected readonly messagingService: MessagingService,
        protected readonly notificationsService: NotificationsService
    ) { }

    @Get(':code')
    @ApiOperation({ summary: 'Получить QR', description: 'Возвращает информацию о QR-коде и наличии привязанной учетной записи' })
    @ApiParam({ name: 'code', type: String, description: 'Значение QR', example: EXAMPLES.QR_CODE })
    @ApiOkResponse({ type: GetResponse })
    @ApiNotFoundResponse({ description: 'QR не найден' })
    async get(@Param('code') code: string): Promise<GetResponse> {
        const result = await this.accountsService.getQr(code);

        const res: GetResponse = {
            qr: {
                code: result.qr.id,
            },
            account: result.account ? {} : undefined,
        };

        return res;
    }

    @Post(':code/link')
    @HttpCode(200)
    @ApiOperation({ summary: 'Привязать QR', description: 'Привязывает QR-код к учетной записи' })
    @ApiParam({ name: 'code', type: String, description: 'Значение QR', example: EXAMPLES.QR_CODE })
    @ApiOkResponse({ type: LinkResponse })
    @ApiNotFoundResponse({ description: 'QR не найден' })
    @ApiBadRequestResponse({ description: 'Некорректная информация в запросе' })
    @ApiConflictResponse({ description: 'QR уже привязан' })
    async link(
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

        await this.storageService.saveVerifyRequest<VerifyRequestPayload>(
            requestId,
            {
                channel: NotificationChannel.Phone,
                address: phoneNumber,
                code: confirmCode,
                payload: {
                    ...body,
                    code
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

    @Post(':code/link/confirm')
    @ApiOperation({ summary: 'Подтвердить привязку QR', description: 'Подтверждает привязку QR-кода к учетной записи' })
    @ApiParam({ name: 'code', type: String, description: 'Значение QR', example: EXAMPLES.QR_CODE })
    @ApiOkResponse()
    @ApiNotFoundResponse({ description: 'QR не найден' })
    @ApiBadRequestResponse({ description: 'Некорректная информация в запросе' })
    @ApiConflictResponse({ description: 'QR уже привязан' })
    async linkConfirm(
        @Param('code') code: string,
        @Body() body: LinkConfirmRequest
    ): Promise<void> {
        const result = await this.storageService.getVerifyRequest<VerifyRequestPayload>(body.verification.id);
        if (!result) {
            throw new BadRequestException('Некорректный ИД запроса');
        }

        if (code !== result.payload.code) {
            throw new BadRequestException('ИД запроса не соответствует QR-коду');
        }

        if (result.code !== body.verification.code) {
            throw new BadRequestException('Неверный код подтверждения');
        }

        await this.accountsService.linkQr(
            code,
            result.payload.phone,
            result.payload.licensePlate
        );
    }

    @Post(':code/notify')
    @ApiOperation({ summary: 'Отправить уведомление', description: 'Отправляет уведомление владельцу QR-кода. Если уведомление уже отправлено, но обратной связи не получено, то возвращает актуальные контакты.' })
    @ApiParam({ name: 'code', type: String, description: 'Значение QR', example: EXAMPLES.QR_CODE })
    @ApiOkResponse({ type: NotifyResponse })
    @ApiNotFoundResponse({ description: 'QR не найден' })
    @ApiConflictResponse({ description: 'QR не привязан' })
    async notify(
        @Param('code') code: string,
        @Body() body: NotifyRequest
    ): Promise<NotifyResponse> {
        const qr = await this.accountsService.getQr(code);
        if (!qr.account) {
            throw new ConflictException('QR не привязан');
        }

        const result = await this.notificationsService.notify(
            qr.account
        );

        const isAlreadyNotified = !result.answer
            && ((new Date()).getTime() - result.notification.sentAt.getTime()) > 5 * 60 * 1000;

        const res: NotifyResponse = {
            answer: result.answer,
            contact: isAlreadyNotified ? qr.account.contacts.find(c => c.channel === NotificationChannel.Phone) : null,
        };

        return res;
    }
}
