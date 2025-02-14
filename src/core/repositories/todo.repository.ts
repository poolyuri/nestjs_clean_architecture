import { TodoEntity } from "@infrastructure/entities/todo.entity";
import { CreatedTodoDto, CreateTodoDto, UpdateTodoDto } from '@infrastructure/entities/dtos/todo/todo.dto';

export interface ITodoRepository {
  findAll(): Promise<TodoEntity[]>;
  findOne(id: number): Promise<TodoEntity | null>;
  create(createTodoDto: CreateTodoDto): Promise<CreatedTodoDto>;
  update(id: number, updateTodoDto: UpdateTodoDto): Promise<void>;
  delete(id: number): Promise<void>;
}
