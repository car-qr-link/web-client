import { BadRequestException, Body, ConflictException, Controller, Get, Logger, Param, Post, Render, Res, UseFilters, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { NotificationsService } from 'src/core/notifications/notifications.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { CaptchaGuard } from 'src/core/captcha/captcha.guard';
import { parsePhoneNumber } from 'libphonenumber-js/mobile';
import { CaptchaService } from 'src/core/captcha/captcha.service';
import { VerficationGuard } from 'src/core/verification/verification.guard';
import { VerificationPayload } from 'src/core/verification/verification.param';
import { VerifyRequestPayload } from 'src/core/accounts/accounts.model';
import { VerificationService } from 'src/core/verification/verification.service';
import { NotificationChannel } from '@car-qr-link/apis';

@Controller()
@UseFilters(AllExceptionsFilter)
export class RootController {
    private readonly logger = new Logger(RootController.name);

    constructor(
        private readonly accountsService: AccountsService,
        private readonly notificationsService: NotificationsService,
        private readonly catpchaService: CaptchaService,
        private readonly verificationService: VerificationService
    ) { }

    @Get()
    @Render('index')
    async index() { }

    @Get('privacy')
    @Render('privacy')
    async privacy() { }

    @Get('contacts')
    @Render('contacts')
    async contacts() { }

    @Get('order')
    @Render('order')
    async order() {
        return {
            body: {
                captcha: this.catpchaService.getCaptchaHtml('capchaCallback')
            }
        }
    }

    @Post('order')
    @UseGuards(CaptchaGuard)
    @Render('order-success')
    async orderPost(
        @Body('fullName') fullName: string,
        @Body('email') email: string,
        @Body('address') address: string,
    ) {
        this.logger.debug(`POST /order`, { fullName, email, address });
        return {
            body: {
                orderId: 123
            }
        };
    }

    @Post()
    async indexPost(
        @Body('code') code: string,
        @Res() res: Response
    ) {
        const { qr, account } = await this.accountsService.getQr(code);
        if (account) {
            const result = await this.notificationsService.notify(account);

            return res.render(
                'success',
                { body: result }
            );
        }

        return res.render(
            'link',
            {
                body: {
                    qr: {
                        code: qr.id
                    },
                    captcha: this.catpchaService.getCaptchaHtml('capchaCallback'),
                }
            }
        );
    }

    @Get(':code')
    async qr(
        @Param('code') code: string,
        @Res() res: Response
    ) {
        return await this.indexPost(code, res);
    }

    @Post('link')
    @UseGuards(CaptchaGuard)
    async link(
        @Body('code') code: string,
        @Body('phone') phone: string,
        @Body('licensePlate') licensePlate: string,
        @Res() res: Response
    ) {
        const phoneNumber = parsePhoneNumber(phone, 'RU')?.format('E.164');
        if (!phoneNumber) {
            throw new BadRequestException('Некорректный формат номера телефона');
        }

        const qr = await this.accountsService.getQr(code);
        if (qr.account) {
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

        return res.render(
            'link-verify',
            { body: { requestId } }
        );
    }

    @Post('link/confirm')
    @UseGuards(VerficationGuard('requestId', 'confirmCode'))
    async linkConfirm(
        @VerificationPayload() data: VerifyRequestPayload,
        @Res() res: Response
    ) {
        this.logger.debug(`POST /link/confirm ${data}`);

        await this.accountsService.linkQr(
            data.code,
            data.phone,
            data.licensePlate
        );

        return res.render(
            'link-success'
        );
    }
}
