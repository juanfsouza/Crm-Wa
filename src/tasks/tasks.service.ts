import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(title: string, description: string, columnId: string) {
    return this.prisma.task.create({
      data: { title, description, columnId },
    });
  }

  async updateTaskStatus(taskId: string, status: string) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }
}
