import { BaseError } from '@car-qr-link/apis';

export abstract class VerificationError extends BaseError {}

export class RequestNotFoundError extends VerificationError {
  constructor(message?: string) {
    super(message || 'Request not found');
  }
}

export class InvalidCodeError extends VerificationError {
  constructor(message?: string) {
    super(message || 'Invalid code');
  }
}
