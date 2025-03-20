import { Worker } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { WhatsAppService } from 'src/whatsapp/whatsapp.service';

@Injectable()
export class QueueWorker {
  constructor(private readonly whatsAppService: WhatsAppService) {
    new Worker('messages', async (job) => {
      console.log(`📩 Processando mensagem para ${job.data.to}...`);
      await this.whatsAppService.sendMessage(job.data.to, job.data.message);
    }, {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });
  }
}
