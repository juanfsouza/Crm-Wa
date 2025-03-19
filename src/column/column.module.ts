import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ColumnsService } from './column.service';
import { ColumnsController } from './column.controller';

@Module({
  imports: [PrismaModule],
  providers: [ColumnsService],
  controllers: [ColumnsController],
})
export class ColumnModule {}
