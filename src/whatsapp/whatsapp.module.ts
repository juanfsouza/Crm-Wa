import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppGateway } from './whatsapp.gateway';

@Module({
  providers: [WhatsAppService, WhatsAppGateway],
  exports: [WhatsAppService],
  controllers: [WhatsAppController],
})
export class WhatsAppModule {}
