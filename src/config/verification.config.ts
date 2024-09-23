import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class VerificationConfig {
    public readonly timeout: number;
    public readonly storageNamespace: string;

    constructor(configService: ConfigService) {
        this.timeout = configService.get('VERIFICATION__TIMEOUT', 5 * 60);
        this.storageNamespace = configService.get('VERIFICATION__STORAGE_NAMESPACE', 'verify');
    }
}
