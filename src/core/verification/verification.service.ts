import { NotificationChannel } from '@car-qr-link/apis';
import { Injectable, Logger } from '@nestjs/common';
import { randomBytes, randomInt } from 'crypto';
import { parsePhoneNumber } from 'libphonenumber-js';
import { VerificationConfig } from 'src/config/verification.config';
import validator from 'validator';
import { MessagingService } from '../messaging/messaging.service';
import { StorageService } from '../storage/storage.service';
import { InvalidCodeError, RequestNotFoundError } from './verification.error';
import { VerifyRequest } from './verification.model';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  private readonly validators: Record<
    NotificationChannel,
    (address: string) => boolean
  > = {
    [NotificationChannel.Phone]: (address: string) =>
      parsePhoneNumber(address, 'RU').isValid(),
    [NotificationChannel.Email]: (address: string) =>
      validator.isEmail(address, { allow_utf8_local_part: true }),
    [NotificationChannel.Telegram]: (address: string) =>
      validator.isInt(address, { min: 1 }),
  };
  private readonly sanitizers: Record<
    NotificationChannel,
    (address: string) => string
  > = {
    [NotificationChannel.Phone]: (address: string) =>
      parsePhoneNumber(address, 'RU').format('E.164'),
    [NotificationChannel.Email]: (address: string) =>
      validator.normalizeEmail(address) as string,
    [NotificationChannel.Telegram]: (address: string) =>
      validator.toInt(address).toFixed(0),
  };

  constructor(
    private readonly config: VerificationConfig,
    private readonly messagingService: MessagingService,
    private readonly storageService: StorageService,
  ) {}

  async sendCode<T>(
    channel: NotificationChannel,
    address: string,
    payload: T | undefined = undefined,
  ): Promise<string> {
    if (!this.validators[channel](address)) {
      throw new Error('Некорректные контактные данные');
    }

    const sanitized = this.sanitizers[channel](address);

    const requestId = randomBytes(18).toString('hex');
    const confirmCode = randomInt(10000, 99999).toString();

    const request: VerifyRequest<T> = {
      channel,
      address: sanitized,
      code: confirmCode,
      payload,
    };

    await this.storageService.save(
      this.keyFor(requestId),
      request,
      this.config.timeout,
    );

    try {
      await this.messagingService.send(
        channel,
        sanitized,
        `${confirmCode} - код подтверждения Мешает.рф`,
      );
    } catch (error) {
      this.logger.error('Failed to send verification code', error);

      await this.storageService.delete(this.keyFor(requestId));

      throw error;
    }

    return requestId;
  }

  async verifyCode<T>(requestId: string, code: string): Promise<T> {
    const request = await this.storageService.get<VerifyRequest<T>>(
      this.keyFor(requestId),
    );
    if (!request) {
      throw new RequestNotFoundError('Некорректный ИД запроса');
    }

    if (request.code !== code) {
      throw new InvalidCodeError('Неверный код подтверждения');
    }

    await this.storageService.delete(this.keyFor(requestId));

    return request.payload;
  }

  private keyFor(requestId: string): string {
    return `${this.config.storageNamespace}:${requestId}`;
  }
}
