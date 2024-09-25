import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Render,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CaptchaGuard } from 'src/core/captcha/captcha.guard';
import { CaptchaService } from 'src/core/captcha/captcha.service';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';

@Controller('order')
@UseFilters(AllExceptionsFilter)
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly catpchaService: CaptchaService) { }

  @Get()
  @Render('order')
  async order() {
    return {
      body: {
        captcha: this.catpchaService.getCaptchaHtml('capchaCallback'),
      },
    };
  }

  @Post()
  @UseGuards(CaptchaGuard)
  @Render('order-success')
  async orderPost(
    @Body('fullName') fullName: string,
    @Body('email') email: string,
    @Body('address') address: string,
  ) {
    this.logger.debug(`New order placed: ${fullName}, ${email}, ${address}`);
    return {
      body: {
        orderId: 123,
      },
    };
  }
}
