import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication
} from '@nestjs/common';
import * as request from 'supertest';
import { TodosController } from './todos.controller';
import { AppModule } from '../../../app.module';
import { AuthDto } from '@infrastructure/entities/dtos/auth/auth.dto';
import { TodoEntity } from '@infrastructure/entities/todo.entity';
import { ITodoServiceInterface, Result } from '@core';
import {
  CreatedTodoDto,
  CreateTodoDto,
  UpdateTodoDto,
} from '@infrastructure/entities/dtos/todo/todo.dto';
import { plainToInstance } from 'class-transformer';
import { randomUUID } from 'crypto';

describe('TodosController', () => {
  let app: INestApplication;

  let controller: TodosController;
  let todoServiceMock: ITodoServiceInterface;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let token: string;
  let idTodo: number;

  beforeAll(async () => {
    todoServiceMock = {} as ITodoServiceInterface;
    todoServiceMock.findAll = jest.fn();
    todoServiceMock.findOne = jest.fn();
    todoServiceMock.create = jest.fn();
    todoServiceMock.update = jest.fn();
    todoServiceMock.delete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    controller = module.get<TodosController>(TodosController);
    httpServer = app.getHttpServer();

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login => should login success', async () => {
    const authDto: AuthDto = {
      username: 'poolyuri',
      password: '123456',
    };

    await request(httpServer)
      .post('/auth/login')
      .send(authDto)
      .then((response) => {
        token = response.body.data.token;
      });
  });

  it('findAll => should find all todos', async () => {
    const todo = {
      id: 1,
    } as TodoEntity;

    const todos: TodoEntity[] = [todo];

    const result: Result = new Result(true, 'Todos found!', todos);

    jest.spyOn(todoServiceMock, 'findAll').mockResolvedValueOnce(result);

    await request(httpServer)
      .get('/todos')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Array);
      });
  });

  it('findOne => should find todo by id', async () => {
    const todo = {
      id: 1,
    } as TodoEntity;

    const result: Result = new Result(true, 'Todo found!', todo);

    jest.spyOn(todoServiceMock, 'findOne').mockResolvedValueOnce(result);

    await request(httpServer)
      .get(`/todos/${todo.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('create => should create todo', async () => {
    const [name] = randomUUID().split('-');
    const createTodoDto: CreateTodoDto = {
      name,
      isDone: true
    };

    const result: Result = new Result(
      true,
      'Todo created!',
      plainToInstance(CreatedTodoDto, createTodoDto),
    );

    jest.spyOn(todoServiceMock, 'create').mockResolvedValue(result);

    await request(httpServer)
      .post('/todos')
      .send(createTodoDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        const { data } = response.body;
        idTodo = data.id;

        expect(typeof idTodo).toBe('number');
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('update => should update todo', async () => {
    const id: number = idTodo;
    const [name] = randomUUID().split('-');
    const updateTodoDto: UpdateTodoDto = {
      name,
      isDone: true
    };

    const result: Result = new Result(
      true,
      'Todo updated!',
      plainToInstance(TodoEntity, updateTodoDto),
    );

    jest.spyOn(todoServiceMock, 'update').mockResolvedValue(result);

    await request(httpServer)
      .put(`/todos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateTodoDto)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('delete => should delete todo', async () => {
    const id: number = idTodo;

    const result: Result = new Result(true, 'Todo deleted!');

    jest.spyOn(todoServiceMock, 'delete').mockResolvedValue(result);

    await request(httpServer)
      .delete(`/todos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(result);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
