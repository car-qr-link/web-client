import { Injectable } from '@nestjs/common';
import { AccountsService } from './external/accounts/accounts.service';

@Injectable()
export class AppService {
  constructor(
    private readonly accountsService: AccountsService
  ) { }

  async getHello(): Promise<string> {
    const response = await this.accountsService.getByQr('123');
    console.log(response);

    return 'Hello World!';
  }
}
