import { Injectable } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';

@Injectable()
export class WhatsAppService {
  private client: Client;

  constructor() {
    const authOptions = {
      authStrategy: new LocalAuth(), // Usando LocalAuth para autenticação persistente
      clientId: 'whatsapp-client', // Identificador único para sua instância
    };

    // Agora passando corretamente as opções de autenticação
    this.client = new Client(authOptions);

    // QR Code event handler (para autenticação inicial)
    this.client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      // Aqui você pode salvar o QR Code e mostrar ao usuário ou fazer outra coisa.
    });

    // Ready event handler
    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
    });

    // Iniciar o cliente WhatsApp
    this.client.initialize();
  }

  // Método para enviar mensagens
  async sendMessage(to: string, message: string) {
    try {
      const chat = await this.client.getChatById(to);
      chat.sendMessage(message);
    } catch (error) {
      console.error('Error sending message', error);
    }
  }
}
