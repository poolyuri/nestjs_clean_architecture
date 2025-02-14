import { CreateTodoDto, UpdateTodoDto } from "@infrastructure/entities/dtos/todo/todo.dto";
import { Result } from "@core";

export const TODO_PORT_SERVICE = 'TodoPortService';

export interface ITodoServiceInterface {
  findAll(): Promise<Result>;
  findOne(id: number): Promise<Result>;
  create(createTodoDto: CreateTodoDto): Promise<Result>;
  update(id: number, updateTodoDto: UpdateTodoDto): Promise<Result>;
  delete(id: number): Promise<Result>;
}