import { Module } from '@nestjs/common';
import { LinkModule } from './link/link.module';
import { OrderModule } from './order/order.module';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [OrderModule, LinkModule, QrModule],
})
export class RootModule {}
