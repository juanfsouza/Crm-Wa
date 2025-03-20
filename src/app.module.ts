import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma/prisma.service';
import { EventsModule } from './events/events.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { WebsocketGateway } from './websocket.gateway';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'common/filters/http-exception.filter';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ColumnModule } from './column/column.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { QueueService } from './queue/queue.service';
import { QueueModule } from './queue/queue.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    UsersModule,
    BoardsModule, 
    TasksModule, 
    EventsModule,
    PrismaModule, 
    PassportModule, 
    AuthModule, 
    ColumnModule,
    WhatsAppModule,
    QueueModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService, 
    PrismaService, 
    WebsocketGateway, QueueService, RedisService,
  ],
})
export class AppModule {}
