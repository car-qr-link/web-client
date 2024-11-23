import { NotificationChannel } from '@car-qr-link/apis';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Logger,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { parsePhoneNumber } from 'libphonenumber-js';
import { VerifyRequestPayload } from 'src/core/accounts/accounts.model';
import { AccountsService } from 'src/core/accounts/accounts.service';
import { CaptchaGuard } from 'src/core/captcha/captcha.guard';
import { VerficationGuard } from 'src/core/verification/verification.guard';
import { VerificationPayload } from 'src/core/verification/verification.param';
import { VerificationService } from 'src/core/verification/verification.service';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';

@Controller('link')
@UseFilters(AllExceptionsFilter)
export class LinkController {
  private readonly logger = new Logger(LinkController.name);

  constructor(
    private readonly accountsService: AccountsService,
    private readonly verificationService: VerificationService,
  ) {}

  @Post()
  @UseGuards(CaptchaGuard)
  async link(
    @Body('code') code: string,
    @Body('phone') phone: string,
    @Body('licensePlate') licensePlate: string,
    @Res() res: Response,
  ) {
    const phoneNumber = parsePhoneNumber(phone, 'RU')?.format('E.164');
    if (!phoneNumber) {
      throw new BadRequestException('Некорректный формат номера телефона');
    }

    const qr = await this.accountsService.getQr(code);
    if (qr.account) {
      throw new ConflictException('QR уже привязан');
    }

    const requestId =
      await this.verificationService.sendCode<VerifyRequestPayload>(
        NotificationChannel.Phone,
        phoneNumber,
        {
          phone: phoneNumber,
          licensePlate: licensePlate,
          code: code,
        },
      );

    return res.render('link-verify', { body: { requestId } });
  }

  @Post('confirm')
  @UseGuards(VerficationGuard('requestId', 'confirmCode'))
  async linkConfirm(
    @VerificationPayload() data: VerifyRequestPayload,
    @Res() res: Response,
  ) {
    await this.accountsService.linkQr(data.code, data.phone, data.licensePlate);

    return res.render('link-success');
  }
}
