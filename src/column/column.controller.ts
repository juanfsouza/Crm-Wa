import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ColumnsService } from './column.service';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  async createColumn(@Body() body: { title: string; boardId: string }) {
    return this.columnsService.createColumn(body.title, body.boardId);
  }

  @Get(':boardId')
  async getColumns(@Param('boardId') boardId: string) {
    return this.columnsService.getColumns(boardId);
  }
}
