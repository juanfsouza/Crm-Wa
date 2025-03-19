import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';

@Module({
  providers: [WhatsAppService],
  exports: [WhatsAppService],
  controllers: [WhatsappController],
})
export class WhatsAppModule {}
