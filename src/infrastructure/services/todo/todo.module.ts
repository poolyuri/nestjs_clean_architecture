import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodosController } from "@infrastructure/controllers/todos/todos.controller";
import { TodoServiceProvider } from "@infrastructure/providers/todo.provider";
import { TodoRepository } from "@infrastructure/repositories/todo.repository";
import { TodoEntity } from "@infrastructure/entities/todo.entity";
import { LoggerService } from "@infrastructure/logger/logger.service";

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodosController],
  providers: [
    LoggerService,
    TodoRepository,
    TodoServiceProvider
  ],
  exports: [
    TodoRepository
  ]
})
export class TodoModule {}