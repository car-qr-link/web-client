import { Module } from '@nestjs/common';
import { QrsModule } from './qrs/qrs.module';

@Module({
  imports: [QrsModule]
})
export class ApiModule { }
