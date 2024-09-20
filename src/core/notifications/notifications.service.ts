import { BaseAccount } from '@car-qr-link/apis';
import { SendNotificationResponse } from '@car-qr-link/apis/dist/notification';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsConfig } from 'src/config/notifications.config';

@Injectable()
export class NotificationsService {
    protected readonly logger = new Logger(NotificationsService.name);

    // protected readonly notificationsClient: notification.Client;

    constructor(
        notificationsConfig: NotificationsConfig,
    ) {
        // this.notificationsClient = new notification.Client(accountsConfig.url);
    }

    async notify(
        account: BaseAccount,
        reasonId: string | undefined
    ): Promise<SendNotificationResponse> {
        this.logger.debug('NOTIFY', account);

        const res: SendNotificationResponse = {
            notification: {
                id: account.id,
                reasonId: reasonId,
                sentAt: account.id === '1' ? new Date() : new Date(0),
            },
            answer: account.id === '1' ? {
                message: 'Answer from driver',
                receivedAt: undefined
            } : null
        };

        return res;
    }
}
