import { plainToInstance } from 'class-transformer';
import { TodoService } from './todo.service';
import { ILogger, ITodoRepository, Result } from '@core';
import { TodoEntity } from '@infrastructure/entities/todo.entity';
import {
  CreatedTodoDto,
  CreateTodoDto,
  UpdateTodoDto,
} from '@infrastructure/entities/dtos/todo/todo.dto';

describe('TodoService', () => {
  let todoService: TodoService;
  let loggerMock: ILogger;
  let todoRepositoryMock: ITodoRepository;

  beforeEach(() => {
    todoService = {} as TodoService;
    todoService.findAll = jest.fn();
    todoService.findOne = jest.fn();
    todoService.create = jest.fn();
    todoService.update = jest.fn();
    todoService.delete = jest.fn();

    loggerMock = {} as ILogger;
    loggerMock.log = jest.fn();

    todoRepositoryMock = {} as ITodoRepository;
    todoRepositoryMock.findAll = jest.fn();
    todoRepositoryMock.findOne = jest.fn();
    todoRepositoryMock.create = jest.fn();
    todoRepositoryMock.update = jest.fn();
    todoRepositoryMock.delete = jest.fn();

    todoService = new TodoService(
      loggerMock,
      todoRepositoryMock
    );
  });

  it('findAll => should return null if todos dont exists', async () => {
    const todo = {
      id: 1,
    } as TodoEntity;

    const todos: TodoEntity[] = [todo];

    jest.spyOn(todoRepositoryMock, 'findAll').mockResolvedValue(todos);

    const result = await todoService.findAll();

    expect(todoRepositoryMock.findAll).toHaveBeenCalled();

    expect(result).toEqual(
      new Result(true, 'Todos found!', plainToInstance(TodoEntity, todos)),
    );
  });

  it('findOne => should return object if exists todo by id', async () => {
    const id: number = 1;
    const todo = {
      id,
    } as TodoEntity | null;

    jest.spyOn(todoRepositoryMock, 'findOne').mockResolvedValue(todo);

    const result = await todoService.findOne(id);

    expect(todoRepositoryMock.findOne).toHaveBeenCalled();
    expect(todoRepositoryMock.findOne).toHaveBeenCalledWith(id);

    expect(result).toEqual(
      new Result(true, 'Todo found!', plainToInstance(TodoEntity, todo)),
    );
  });

  it('create => should create a new todo and return data', async () => {
    const createTodoDto: CreateTodoDto = {
      name: 'todoname',
      isDone: true
    };

    const createdTodoDto: CreatedTodoDto = {
      name: 'todoname',
      isDone: true
    };

    jest
      .spyOn(todoRepositoryMock, 'create')
      .mockResolvedValue(createdTodoDto as TodoEntity);

    const result = await todoService.create(createTodoDto);

    expect(todoRepositoryMock.create).toHaveBeenCalled();
    expect(todoRepositoryMock.create).toHaveBeenCalledWith(createTodoDto);

    expect(result).toEqual(
      new Result(
        true,
        'Todo created!',
        plainToInstance(CreatedTodoDto, createTodoDto),
      ),
    );
  });

  it('update => should update a todo by id', async () => {
    const id = 1;
    const updateTodoDto: UpdateTodoDto = {
      name: 'todoname',
      isDone: true
    };

    jest.spyOn(todoRepositoryMock, 'update');

    const result = await todoService.update(id, updateTodoDto);

    expect(todoRepositoryMock.update).toHaveBeenCalled();
    expect(todoRepositoryMock.update).toHaveBeenCalledWith(id, updateTodoDto);

    expect(result).toEqual(new Result(true, 'Todo updated!', updateTodoDto));
  });

  it('remove => should delete a todo by id', async () => {
    const id = 1;

    jest.spyOn(todoRepositoryMock, 'delete');

    const result = await todoService.delete(id);

    expect(todoRepositoryMock.delete).toHaveBeenCalled();
    expect(todoRepositoryMock.delete).toHaveBeenCalledWith(id);

    expect(result).toEqual(new Result(true, 'Todo deleted!'));
  });
});
