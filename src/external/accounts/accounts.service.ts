import { HttpModule, HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsService {
    constructor(
        private readonly httpService: HttpService
    ) { }

    async getByQr(qr: string) {
        return this.httpService.get(`/api/v1/accounts/qr/${qr}`);
    }
}
