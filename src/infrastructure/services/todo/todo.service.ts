import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreatedTodoDto, CreateTodoDto, UpdateTodoDto } from '../../entities/dtos/todo/todo.dto';
import { TodoEntity } from '../../entities/todo.entity';
import { ILogger, ITodoRepository, ITodoServiceInterface, Result } from '@core';

@Injectable()
export class TodoService implements ITodoServiceInterface {
  constructor(
    private readonly logger: ILogger,
    private readonly todoRepository: ITodoRepository
  ) {}

  async findAll(): Promise<Result> {
    const todos: TodoEntity[] = await this.todoRepository.findAll();
    return new Result(true, 'Todos found!', plainToInstance(TodoEntity, todos));
  }

  async findOne(id: number): Promise<Result> {
    const todo: TodoEntity | null = await this.todoRepository.findOne(id);
    return new Result(true, 'Todo found!', plainToInstance(TodoEntity, todo));
  }

  async create(createTodoDto: CreateTodoDto): Promise<Result> {
    const todo: CreateTodoDto = await this.todoRepository.create(createTodoDto);

    this.logger.log(TodoService.name, 'new todo have been inserted');
    return new Result(true, 'Todo created!', plainToInstance(CreatedTodoDto, todo));
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Result> {
    const updateTodo = plainToInstance(TodoEntity, updateTodoDto);    
    await this.todoRepository.update(id, updateTodo);

    this.logger.log(TodoService.name, 'todo have been updated');
    return new Result(true, 'Todo updated!', updateTodo);
  }

  async delete(id: number): Promise<Result> {
    await this.todoRepository.delete(id);

    this.logger.log(TodoService.name, 'todo have been eleted');
    return new Result(true, 'Todo deleted!');
  }
}