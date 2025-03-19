import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(@Body() body: { title: string; userId: string }) {
    return this.boardsService.createBoard(body.title, body.userId);
  }

  @Get(':userId')
  async getBoards(@Param('userId') userId: string) {
    return this.boardsService.getBoards(userId);
  }
}
