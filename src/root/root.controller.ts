import { Body, Controller, Get, Logger, NotFoundException, Param, Post, Redirect, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { request } from 'http';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { NotificationsService } from 'src/core/notifications/notifications.service';

@Controller()
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
        try {
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
        } catch (error) {
            const context = { body: { error } };

            if (error instanceof NotFoundException) {
                context.body.error.message = 'QR-код не найден';
            }

            return res.render(
                'error',
                context
            );
        }
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
        try {
            const { verification } = await this.accountsService.linkQrPrepare(code, phone, licensePlate);
            return res.render(
                'link-verify',
                { body: { requestId: verification.id } }
            );
        } catch (error) {
            return res.render(
                'error',
                { body: { error } }
            );
        }
    }

    @Post('link/confirm')
    async linkConfirm(
        @Body('requestId') requestId: string,
        @Body('confirmCode') confirmCode: string,
        @Res() res: Response
    ) {
        try {
            await this.accountsService.linkQrConfirm(requestId, confirmCode);
            return res.render(
                'link-success'
            );
        } catch (error) {
            return res.render(
                'error',
                { body: { error } }
            );
        }
    }
}
