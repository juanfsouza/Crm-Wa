import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import { PrismaClient } from '@prisma/client';
import * as qrcode from 'qrcode';
import { WhatsAppGateway } from './whatsapp.gateway';
import { QueueService } from 'src/queue/queue.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class WhatsAppService {
  private client: Client;
  private prisma = new PrismaClient();

  constructor(
    @Inject(forwardRef(() => WhatsAppGateway)) private whatsappGateway: WhatsAppGateway,
    private queueService: QueueService,
    private redisService: RedisService,
  ) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      qrcode.toFile('qrcode.png', qr, (err) => {
        if (err) console.error('Erro ao gerar QR Code:', err);
      });
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp client is ready!');
    });

    this.client.on('message', async (message: Message) => {
      console.log(`📩 Mensagem recebida de ${message.from}: ${message.body}`);
    
      const contact = await message.getContact();
      const profilePicUrl = await contact.getProfilePicUrl();
    
      // Salvar mensagem no banco de dados
      await this.prisma.message.create({
        data: {
          from: message.from,
          content: message.body,
          name: contact.pushname || "Desconhecido",
          profilePic: profilePicUrl || null,
        },
      });
    
      // Enviar para o frontend via WebSocket
      this.whatsappGateway.server.emit('newMessage', {
        from: message.from,
        name: contact.pushname || "Desconhecido",
        profilePic: profilePicUrl || null,
        content: message.body,
      });
    });

    this.client.initialize();
  }

  // ✅ Método para buscar mensagens do banco de dados
  async getMessages() {
    return this.prisma.message.findMany();
  }

  // ✅ Método para enviar mensagens
  async sendMessage(to: string, message: string) {
    // ✅ Adiciona a mensagem à fila
    await this.queueService.addMessageToQueue(to, message);

    try {
      const chatId = to.includes('@c.us') ? to : `${to}@c.us`;

      // Antes de enviar, armazenamos o status da mensagem no Redis
      await this.redisService.set(`messageStatus:${to}:${message}`, 'sending');

      // Enviar mensagem via WhatsApp
      await this.client.sendMessage(chatId, message);

      // Atualiza o status da mensagem para "enviado"
      await this.redisService.set(`messageStatus:${to}:${message}`, 'sent');

      return { success: true, message: 'Mensagem enviada com sucesso!' };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      await this.redisService.set(`messageStatus:${to}:${message}`, 'failed');
      return { success: false, error: 'Erro ao enviar mensagem' };
    }
  }

  // Método para checar o status de uma mensagem no Redis
  async getMessageStatus(to: string, message: string) {
    return await this.redisService.get(`messageStatus:${to}:${message}`);
  }
}
