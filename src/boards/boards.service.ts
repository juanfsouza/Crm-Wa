import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async createBoard(title: string, userId: string) {
    return this.prisma.board.create({
      data: { title, userId },
    });
  }

  async getBoards(userId: string) {
    return this.prisma.board.findMany({
      where: { userId },
      include: { columns: true },
    });
  }
}
