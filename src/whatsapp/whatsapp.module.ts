import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppGateway } from './whatsapp.gateway';
import { QueueModule } from 'src/queue/queue.module';
import { QueueService } from 'src/queue/queue.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [QueueModule, RedisModule],
  providers: [WhatsAppService, WhatsAppGateway, QueueService],
  exports: [WhatsAppService],
  controllers: [WhatsAppController],
})
export class WhatsAppModule {}
