import { Body, Controller, Get, Logger, Param, Post, Render, Res, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { NotificationsService } from 'src/core/notifications/notifications.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Controller()
@UseFilters(AllExceptionsFilter)
export class RootController {
    private readonly logger = new Logger(RootController.name);

    constructor(
        private readonly accountsService: AccountsService,
        private readonly notificationsService: NotificationsService
    ) { }

    @Get()
    @Render('index')
    async index() { }

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
            { body: { qr: { code: qr.id } } }
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
    async link(
        @Body('code') code: string,
        @Body('phone') phone: string,
        @Body('licensePlate') licensePlate: string,
        @Res() res: Response
    ) {
        const { verification } = await this.accountsService.linkQrPrepare(code, phone, licensePlate);
        return res.render(
            'link-verify',
            { body: { requestId: verification.id } }
        );
    }

    @Post('link/confirm')
    async linkConfirm(
        @Body('requestId') requestId: string,
        @Body('confirmCode') confirmCode: string,
        @Res() res: Response
    ) {
        await this.accountsService.linkQrConfirm(requestId, confirmCode);
        return res.render(
            'link-success'
        );
    }
}
