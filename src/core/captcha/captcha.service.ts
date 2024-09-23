import { Injectable, Logger } from '@nestjs/common';
import { CaptchaConfig } from 'src/config/captcha.config';
import * as querystring from 'querystring';

@Injectable()
export class CaptchaService {
    private readonly logger = new Logger(CaptchaService.name);

    constructor(
        private readonly config: CaptchaConfig
    ) {
        if (!config.serverKey) {
            throw new Error('Captcha server key is not defined');
        }
    }

    async verify(token: string, ip: string): Promise<void> {
        const params = querystring.stringify({
            secret: this.config.serverKey,
            token,
            ip
        });

        const res = await fetch(
            'https://smartcaptcha.yandexcloud.net/validate',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
                body: params,
            }
        );

        if (!res.ok) {
            return;
        }

        const body: { status: 'ok' | 'failed', message: string } = await res.json();

        if (body.status !== 'ok') {
            this.logger.error(body.message);
            throw new Error('Captcha verification failed');
        }
    }
}
