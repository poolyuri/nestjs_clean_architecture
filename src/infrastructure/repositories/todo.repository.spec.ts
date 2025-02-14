import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoRepository } from './todo.repository';
import { TodoEntity } from '@infrastructure/entities/todo.entity';
import {
  CreatedTodoDto,
  CreateTodoDto,
  UpdateTodoDto,
} from '@infrastructure/entities/dtos/todo/todo.dto';

describe('TodoRepository', () => {
  let todoRepository: TodoRepository;
  let todoRepositoryToken: Repository<TodoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TodoRepository,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn().mockImplementationOnce(() => Promise.resolve()),
            delete: jest.fn().mockImplementationOnce(() => Promise.resolve()),
          },
        },
      ],
    }).compile();

    todoRepository = module.get<TodoRepository>(TodoRepository);
    todoRepositoryToken = module.get<Repository<TodoEntity>>(
      getRepositoryToken(TodoEntity),
    );
  });

  it('should be defined', async () => {
    expect(TodoRepository).toBeDefined();
  });

  it('findAll => should return null if todos dont exists', async () => {
    const todo = {
      id: 1,
    } as TodoEntity;

    const todos: TodoEntity[] = [todo];

    jest.spyOn(todoRepositoryToken, 'find').mockResolvedValue(todos);

    const result = await todoRepository.findAll();

    expect(todoRepositoryToken.find).toHaveBeenCalled();

    expect(result).toEqual(todos);
  });

  it('findOne => should return null if todo by id does not exist', async () => {
    const id: number = 1;

    jest.spyOn(todoRepositoryToken, 'findOneBy').mockResolvedValue(null);

    const result = await todoRepository.findOne(id);

    expect(todoRepositoryToken.findOneBy).toHaveBeenCalled();
    expect(todoRepositoryToken.findOneBy).toHaveBeenCalledWith({ id });

    expect(result).toBe(null);
  });

  it('findOne => should return object if exists todo by id', async () => {
    const id: number = 1;
    const todo = {
      id,
    } as TodoEntity | null;

    jest.spyOn(todoRepositoryToken, 'findOneBy').mockResolvedValue(todo);

    const result = await todoRepository.findOne(id);

    expect(todoRepositoryToken.findOneBy).toHaveBeenCalled();
    expect(todoRepositoryToken.findOneBy).toHaveBeenCalledWith({ id });

    expect(result).toEqual(todo);
  });

  it('create => should create a new todo and return its data', async () => {
    const createTodoDto: CreateTodoDto = {
      name: 'todoname',
      isDone: true,
    };

    const createdTodoDto: CreatedTodoDto = {
      name: 'todoname',
      isDone: true,
    };

    jest
      .spyOn(todoRepositoryToken, 'save')
      .mockResolvedValue(createdTodoDto as TodoEntity);

    const result = await todoRepository.create(createTodoDto);

    expect(todoRepositoryToken.save).toHaveBeenCalled();
    expect(todoRepositoryToken.save).toHaveBeenCalledWith(createTodoDto);

    expect(result).toEqual(createdTodoDto);
  });

  it('update => should update a todo by id', async () => {
    const id = 1;

    const updateTodoDto: UpdateTodoDto = {
      name: 'todoname',
      isDone: true,
    };

    jest.spyOn(todoRepositoryToken, 'update');

    const result = await todoRepository.update(id, updateTodoDto);

    expect(todoRepositoryToken.update).toHaveBeenCalled();
    expect(todoRepositoryToken.update).toHaveBeenCalledWith(id, updateTodoDto);

    expect(result).toBe(void 0);
  });

  it('remove => should delete a todo by id', async () => {
    const id = 1;
    jest.spyOn(todoRepositoryToken, 'delete');

    const result = await todoRepository.delete(id);

    expect(todoRepositoryToken.delete).toHaveBeenCalled();
    expect(todoRepositoryToken.delete).toHaveBeenCalledWith(id);

    expect(result).toBe(void 0);
  });
});
