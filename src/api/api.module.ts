import { Module } from '@nestjs/common';
import { QrsModule } from './qrs/qrs.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [QrsModule, NotificationsModule]
})
export class ApiModule {}
