import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AccountsConfig {
    public readonly url: string;

    constructor(configService: ConfigService) {
        this.url = configService.get('ACCOUNTS__URL', 'http://accounts:3000');
    }
}