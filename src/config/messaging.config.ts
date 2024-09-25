import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagingConfig {
  public readonly brokerUrl: string;
  public readonly queuePrefix: string;

  constructor(configService: ConfigService) {
    this.brokerUrl = configService.get(
      'MESSAGING__BROKER_URL',
      'redis://localhost:6379/0',
    );
    this.queuePrefix = configService.get(
      'MESSAGING__QUEUE_PREFIX',
      'messages:send:',
    );
  }
}
