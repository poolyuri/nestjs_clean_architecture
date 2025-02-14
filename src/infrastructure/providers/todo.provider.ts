import { TodoRepository } from '../repositories/todo.repository';
import { TodoService } from '../services/todo/todo.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { TODO_PORT_SERVICE } from '@core';

export const TodoServiceProvider = {
  inject: [LoggerService, TodoRepository],
  provide: TODO_PORT_SERVICE,
  useFactory: (
    loggerService: LoggerService,
    todoRepository: TodoRepository
  ) => new TodoService(loggerService, todoRepository),
};
