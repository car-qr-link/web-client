import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageConfig {
    public readonly url: string;

    constructor(configService: ConfigService) {
        this.url = configService.get('STORAGE__URL', 'redis://localhost:6379/0');
    }
}
