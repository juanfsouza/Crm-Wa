import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('taskUpdated')
  handleTaskUpdate(@MessageBody() data: { taskId: string; status: string }) {
    this.server.emit('taskUpdated', data);
  }
}
