import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Request } from 'express';
import { VerificationService } from './verification.service';

declare module 'express' {
  export interface Request {
    verificationPayload?: any;
  }
}

export const VerficationGuard = <T>(
  requestIdField: string = 'requestId',
  confirmCodeField: string = 'confirmCode',
) => {
  @Injectable()
  class VerificationGuardMixin implements CanActivate {
    constructor(readonly verificationService: VerificationService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();

      if (
        !(requestIdField in request.body && confirmCodeField in request.body)
      ) {
        throw new BadRequestException(
          'Не указан ИД запроса или код подтверждения',
        );
      }

      const requestId = request.body[requestIdField];
      const confirmCode = request.body[confirmCodeField];

      const data = await this.verificationService.verifyCode<T>(
        requestId,
        confirmCode,
      );
      if (!data) {
        throw new BadRequestException(
          'Код не действителен, попробуйте ещё раз',
        );
      }

      request.verificationPayload = data;

      return true;
    }
  }

  return mixin(VerificationGuardMixin);
};
