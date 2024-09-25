import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaptchaConfig {
  public readonly serverKey: string;
  public readonly clientKey: string;

  constructor(configService: ConfigService) {
    this.serverKey = configService.get('CAPTCHA__SERVER_KEY', '');
    this.clientKey = configService.get('CAPTCHA__CLIENT_KEY', '');
  }
}
