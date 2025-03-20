import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WhatsAppService } from './whatsapp.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
export class WhatsAppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => WhatsAppService)) private readonly whatsappService: WhatsAppService,
  ) {}

  afterInit(server: Server) {
    console.log('🚀 WebSocket inicializado!');
  }

  handleConnection(client: Socket) {
    console.log(`✅ Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() data: { to: string; message: string }) {
    await this.whatsappService.sendMessage(data.to, data.message);
    this.server.emit('messageSent', { to: data.to, message: data.message });
  }
}