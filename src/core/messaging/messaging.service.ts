import { messaging, NotificationChannel } from '@car-qr-link/apis';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessagingConfig } from 'src/config/messaging.config';

@Injectable()
export class MessagingService implements OnModuleInit, OnModuleDestroy {
  protected readonly client: messaging.Client;

  constructor(protected readonly config: MessagingConfig) {
    this.client = new messaging.Client(config.brokerUrl);
  }

  async send(
    channel: NotificationChannel,
    address: string,
    content: string,
  ): Promise<void> {
    await this.client.publish(this.config.queuePrefix + channel, {
      channel: channel,
      message: content,
      to: address,
    });
  }

  async onModuleInit() {
    await this.client.start();
  }
  async onModuleDestroy() {
    await this.client.close();
  }
}
