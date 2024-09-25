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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { CaptchaGuard } from 'src/core/captcha/captcha.guard';
import { CaptchaService } from 'src/core/captcha/captcha.service';
import { NotificationsService } from 'src/core/notifications/notifications.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Controller()
@UseFilters(AllExceptionsFilter)
export class RootController {
  private readonly logger = new Logger(RootController.name);

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

  @Get('order')
  @Render('order')
  async order() {
    return {
      body: {
        captcha: this.catpchaService.getCaptchaHtml('capchaCallback'),
      },
    };
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
        orderId: 123,
      },
    };
  }

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
