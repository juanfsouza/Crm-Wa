import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private messageQueue: Queue;

  constructor() {
    this.messageQueue = new Queue('messages', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  async addMessageToQueue(to: string, message: string) {
    await this.messageQueue.add('sendMessage', { to, message });
  }
}
