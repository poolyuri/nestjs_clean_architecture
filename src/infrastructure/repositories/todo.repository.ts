import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TodoEntity } from "../entities/todo.entity";
import { CreateTodoDto, CreatedTodoDto, UpdateTodoDto } from "../entities/dtos/todo/todo.dto";
import { ITodoRepository } from "@core";

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly userRepository: Repository<TodoEntity>
  ) {}

  async findAll(): Promise<TodoEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<TodoEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(createTodoDto: CreateTodoDto): Promise<CreatedTodoDto> {
    return await this.userRepository.save(createTodoDto);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<void> {
    await this.userRepository.update(id, updateTodoDto);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
