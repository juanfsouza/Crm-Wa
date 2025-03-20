import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import 'dotenv/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS com configurações detalhadas
  app.enableCors({
    origin: 'http://localhost:5173', // Apenas o frontend está autorizado
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Configuração específica do WebSocket (adicionar manualmente)
  app.useWebSocketAdapter(new IoAdapter(app));

  // Testar conexão com o banco
  const prismaService = app.get(PrismaService);
  await prismaService.$connect();
  console.log('✅ Banco de dados conectado!');

  await app.listen(3000);
  console.log('🚀 Servidor rodando em http://localhost:3000');
}

bootstrap();
