import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { StorageConfig } from 'src/config/storage.config';
import { VerifyRequest } from './storage.dto';

@Injectable()
export class StorageService implements OnModuleInit, OnModuleDestroy {
    protected readonly logger = new Logger(StorageService.name);

    protected readonly namespace = "web-client";
    protected readonly timeout = 60 * 5;

    protected readonly client: RedisClientType;

    constructor(config: StorageConfig) {
        this.client = createClient({
            url: config.url
        });
        this.client.on('error', (err) => {
            this.logger.error(err);
        });
    }

    async saveVerifyRequest(id: string, data: VerifyRequest): Promise<void> {
        await this.client.setEx(
            `${this.namespace}:verify:${id}`,
            this.timeout,
            JSON.stringify(data)
        );
    }

    async getVerifyRequest(id: string): Promise<VerifyRequest | null> {
        const data = await this.client.get(`${this.namespace}:verify:${id}`);
        return data ? JSON.parse(data) : null
    }

    async onModuleInit() {
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
