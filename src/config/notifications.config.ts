import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationsConfig {
    public readonly url: string;

    constructor(configService: ConfigService) {
        this.url = configService.get('NOTIFICATIONS__URL', 'http://notifications:3000');
    }
}
