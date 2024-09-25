import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Render,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { CaptchaService } from 'src/core/captcha/captcha.service';
import { NotificationsService } from 'src/core/notifications/notifications.service';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';

@Controller()
@UseFilters(AllExceptionsFilter)
export class QrController {
  private readonly logger = new Logger(QrController.name);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly notificationsService: NotificationsService,
    private readonly catpchaService: CaptchaService,
  ) {}

  @Get()
  @Render('index')
  async index() {}

  @Get('privacy')
  @Render('privacy')
  async privacy() {}

  @Get('contacts')
  @Render('contacts')
  async contacts() {}

  @Post()
  async indexPost(@Body('code') code: string, @Res() res: Response) {
    const { qr, account } = await this.accountsService.getQr(code);
    if (account) {
      const result = await this.notificationsService.notify(account);

      return res.render('success', { body: result });
    }

    return res.render('link', {
      body: {
        qr: {
          code: qr.id,
        },
        captcha: this.catpchaService.getCaptchaHtml('capchaCallback'),
      },
    });
  }

  @Get(':code')
  async qr(@Param('code') code: string, @Res() res: Response) {
    return await this.indexPost(code, res);
  }
}
