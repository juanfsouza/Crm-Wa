import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService {
  private redis: RedisClient;

  constructor() {
    // Instanciando o cliente Redis
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  // Método para armazenar dados
  async set(key: string, value: string, expire: number = 3600) {
    await this.redis.set(key, value, 'EX', expire);
  }

  // Método para recuperar dados
  async get(key: string) {
    return await this.redis.get(key);
  }

  // Método para excluir dados
  async del(key: string) {
    await this.redis.del(key);
  }
}
