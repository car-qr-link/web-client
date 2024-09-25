import { BaseAccount, NotificationChannel } from '@car-qr-link/apis';
import { SendNotificationResponse } from '@car-qr-link/apis/dist/notification';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsConfig } from 'src/config/notifications.config';

@Injectable()
export class NotificationsService {
  protected readonly logger = new Logger(NotificationsService.name);

  // protected readonly notificationsClient: notification.Client;

  constructor(private readonly config: NotificationsConfig) {
    // this.notificationsClient = new notification.Client(accountsConfig.url);
  }

  async notify(account: BaseAccount) {
    this.logger.debug('NOTIFY', account);

    const res: SendNotificationResponse = {
      notification: {
        id: account.id,
        sentAt: account.id === '1' ? new Date() : new Date(0),
      },
      answer:
        account.id === '1'
          ? {
              message: 'Answer from driver',
              receivedAt: undefined,
            }
          : null,
    };

    return {
      notification: res.notification,
      answer: res.answer,
      contact:
        !res.answer &&
        new Date().getTime() - res.notification.sentAt.getTime() >
          this.config.waitTimeSecs
          ? account.contacts.find(
              (c) => c.channel === NotificationChannel.Phone,
            )
          : undefined,
    };
  }
}
