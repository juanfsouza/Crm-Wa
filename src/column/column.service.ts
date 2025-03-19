import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async createColumn(title: string, boardId: string) {
    return this.prisma.column.create({
      data: { title, boardId },
    });
  }

  async getColumns(boardId: string) {
    return this.prisma.column.findMany({
      where: { boardId },
      include: { tasks: true },
    });
  }
}
