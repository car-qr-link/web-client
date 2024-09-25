import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { StorageConfig } from 'src/config/storage.config';

@Injectable()
export class StorageService implements OnModuleInit, OnModuleDestroy {
  protected readonly logger = new Logger(StorageService.name);

  protected readonly namespace: string;

  protected readonly client: RedisClientType;

  constructor(config: StorageConfig) {
    this.namespace = config.namespace;
    this.client = createClient({
      url: config.url,
    });
    this.client.on('error', (err) => {
      this.logger.error(err);
    });
  }

  async save<T>(key: string, data: T, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(
        `${this.namespace}:${key}`,
        ttl,
        JSON.stringify(data),
      );
    } else {
      await this.client.set(`${this.namespace}:${key}`, JSON.stringify(data));
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(`${this.namespace}:${key}`);
    return data ? JSON.parse(data) : null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(`${this.namespace}:${key}`);
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
