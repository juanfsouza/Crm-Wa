import { Controller, Post, Patch, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() body: { title: string; description: string; columnId: string }) {
    return this.tasksService.createTask(body.title, body.description, body.columnId);
  }

  @Patch()
  async updateTask(@Body() body: { taskId: string; status: string }) {
    return this.tasksService.updateTaskStatus(body.taskId, body.status);
  }
}
