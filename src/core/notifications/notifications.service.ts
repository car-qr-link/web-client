import {
  BaseAccount,
  Contact,
  notification,
  NotificationChannel,
} from '@car-qr-link/apis';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsConfig } from 'src/config/notifications.config';

@Injectable()
export class NotificationsService {
  protected readonly logger = new Logger(NotificationsService.name);

  protected readonly notificationsClient: notification.Client;

  constructor(private readonly config: NotificationsConfig) {
    this.notificationsClient = new notification.Client(config.url);
  }

  async notify(account: BaseAccount): Promise<{
    notification: notification.Notification;
    answer: notification.Answer;
    contact?: Contact;
  }> {
    const res = await this.notificationsClient.sendNotification({
      account: account,
      notification: {},
    });

    return {
      notification: res.notification,
      answer: res.answer,
      contact:
        !res.answer &&
        new Date().getTime() - res.notification.sentAt.getTime() >
          this.config.waitTime
          ? account.contacts.find(
              (c) => c.channel === NotificationChannel.Phone,
            )
          : undefined,
    };
  }
}
