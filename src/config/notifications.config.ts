import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationsConfig {
    public readonly url: string;
    public readonly waitTimeSecs: number;

    constructor(configService: ConfigService) {
        this.url = configService.get('NOTIFICATIONS__URL', 'http://notifications:3000');
        this.waitTimeSecs = configService.get('NOTIFICATIONS__WAIT_TIME', 5 * 60);
    }

    public get waitTime(): number {
        return this.waitTimeSecs * 1000;
    }
}
