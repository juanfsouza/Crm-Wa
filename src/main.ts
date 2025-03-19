import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import 'dotenv/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Testar conexão com o banco
  const prismaService = app.get(PrismaService);
  await prismaService.$connect();
  console.log('✅ Banco de dados conectado!');

  await app.listen(3000);
  console.log('🚀 Servidor rodando em http://localhost:3000');
}
bootstrap();