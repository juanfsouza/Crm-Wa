import { Injectable } from '@nestjs/common';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import { PrismaClient } from '@prisma/client';
import * as qrcode from 'qrcode';
import { WhatsAppGateway } from './whatsapp.gateway';

@Injectable()
export class WhatsAppService {
  private client: Client;
  private prisma = new PrismaClient();

  constructor(private whatsappGateway: WhatsAppGateway) {
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

      // Salvar mensagem no banco de dados
      await this.prisma.message.create({
        data: {
          from: message.from,
          content: message.body,
        },
      });

      // Enviar mensagem para o frontend via WebSockets
      this.whatsappGateway.server.emit('newMessage', {
        from: message.from,
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
    try {
      const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
      await this.client.sendMessage(chatId, message);
      return { success: true, message: 'Mensagem enviada com sucesso!' };
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return { success: false, error: 'Erro ao enviar mensagem' };
    }
  }
}
