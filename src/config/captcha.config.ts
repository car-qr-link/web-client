import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CaptchaConfig {
    public readonly serverKey: string;

    constructor(configService: ConfigService) {
        this.serverKey = configService.get('CAPTCHA__SERVER_KEY', '');
    }
}
