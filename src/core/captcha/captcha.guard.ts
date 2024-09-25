import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CaptchaService } from './captcha.service';

@Injectable()
export class CaptchaGuard implements CanActivate {
  private readonly logger = new Logger(CaptchaGuard.name);

  constructor(private readonly captchaService: CaptchaService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const token = request.body['smart-token'];

    return this.captchaService
      .verify(token, ip)
      .then(() => true)
      .catch((e) => {
        throw new BadRequestException('Не пройдена проверка на человечность', {
          cause: e,
        });
      });
  }
}
