import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TodoEntity } from '../../entities/todo.entity';
import { CreateTodoDto, UpdateTodoDto } from '../../entities/dtos/todo/todo.dto';
import { JwtAuthGuard } from '@infrastructure/common/guards/auth.guard';
import { ITodoServiceInterface, TODO_PORT_SERVICE, Result } from '@core';

@Controller('todos')
@ApiResponse({ status: 401, description: 'No authorization token was found' })
@ApiResponse({ status: 500, description: 'Internal error' })
export class TodosController {
  constructor(
    @Inject(TODO_PORT_SERVICE)
    private readonly todoServiceInterface: ITodoServiceInterface
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ description: "Find all todos", type: Array<TodoEntity> })
  @ApiOperation({ summary: 'Find all todos' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Result> {
    return await this.todoServiceInterface.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Find todo", type: TodoEntity })
  @ApiOperation({ summary: 'Find todo' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Result> {    
    return await this.todoServiceInterface.findOne(id);
  }

  @ApiResponse({ description: "Create todo", type: CreateTodoDto })
  @ApiOperation({ summary: 'Create todo' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todoServiceInterface.create(createTodoDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Update todo", type: UpdateTodoDto })
  @ApiOperation({ summary: 'Update todo' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todoServiceInterface.update(id, updateTodoDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Delete todo", type: [Number] })
  @ApiOperation({ summary: 'Delete todo' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.todoServiceInterface.delete(id);
  }
}
