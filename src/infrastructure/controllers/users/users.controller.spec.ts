import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  HttpStatus,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { AppModule } from '../../../app.module';
import { AuthDto } from '@infrastructure/entities/dtos/auth/auth.dto';
import { UserEntity } from '@infrastructure/entities/user.entity';
import { IUserServiceInterface, Result } from '@core';
import {
  CreatedUserDto,
  CreateUserDto,
  UpdateUserDto,
} from '@infrastructure/entities/dtos/user/user.dto';
import { plainToInstance } from 'class-transformer';
import { CryptoService } from '@infrastructure/services/crypto/crypto.service';
import { randomUUID } from 'crypto';

describe('UsersController', () => {
  let app: INestApplication;

  let controller: UsersController;
  let userServiceMock: IUserServiceInterface;
  let cryptoServiceMock: CryptoService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let token: string;
  let idUser: number;
  let username: string;

  beforeAll(async () => {
    userServiceMock = {} as IUserServiceInterface;
    userServiceMock.findAll = jest.fn();
    userServiceMock.findOne = jest.fn();
    userServiceMock.create = jest.fn();
    userServiceMock.update = jest.fn();
    userServiceMock.delete = jest.fn();

    cryptoServiceMock = {} as CryptoService;
    cryptoServiceMock.encrypt = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    controller = module.get<UsersController>(UsersController);
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

  it('findAll => Unauthorized token', async () => {
    await request(httpServer)
      .get('/users')
      .set(
        'Authorization',
        `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InB1YmxpY0lkIjoicG9vbHl1cmk5OTk5IiwibmFtZSI6IlBvb2wgWXVyaXZpbGNhIEFsYW5pYSJ9LCJpYXQiOjE3Mzk0MDU0NDYsImV4cCI6MTE1MzQ2NzY1NDQ2fQ.0R9JjzFSBOEdKihaIdlI7j3_pLtkVy2CwHZ0FvBWFOA'}`,
      )
      .expect(HttpStatus.UNAUTHORIZED)
      .catch((error) => {
        expect(error.status).toBe(401);
        expect(error).toBeInstanceOf(UnauthorizedException);
      });
  });

  it('findAll => should find all users', async () => {
    const user = {
      id: 1,
    } as UserEntity;

    const users: UserEntity[] = [user];

    const result: Result = new Result(true, 'Users found!', users);

    jest.spyOn(userServiceMock, 'findAll').mockResolvedValueOnce(result);

    await request(httpServer)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Array);
      });
  });

  it('findOne => should find user by id', async () => {
    const user = {
      id: 1,
    } as UserEntity;

    const result: Result = new Result(true, 'User found!', user);

    jest.spyOn(userServiceMock, 'findOne').mockResolvedValueOnce(result);

    await request(httpServer)
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('create => should create user', async () => {
    const [value] = randomUUID().split('-');
    username = value;
    const createUserDto: CreateUserDto = {
      username,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
    };

    const password = createUserDto.password;
    const result: Result = new Result(
      true,
      'User created!',
      plainToInstance(CreatedUserDto, createUserDto),
    );

    jest.spyOn(cryptoServiceMock, 'encrypt').mockReturnValue(password);
    jest.spyOn(userServiceMock, 'create').mockResolvedValue(result);

    await request(httpServer)
      .post('/users')
      .send(createUserDto)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        const { data } = response.body;
        idUser = data.id;
        
        expect(typeof idUser).toBe('number');
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('create => should error already exists a user with the same username', async () => {
    const createUserDto: CreateUserDto = {
      username,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      password: 'password',
    };

    const password = createUserDto.password;

    jest.spyOn(cryptoServiceMock, 'encrypt').mockReturnValue(password);
    jest
      .spyOn(userServiceMock, 'create')
      .mockRejectedValue(
        new ConflictException('Already exists a user with the same username'),
      );

    await request(httpServer)
      .post('/users')
      .send(createUserDto)
      .expect(HttpStatus.CONFLICT)
      .catch((error) => {
        expect(error.status).toBe(409);
        expect(error.message).toBe(
          'Already exists a user with the same username',
        );
        expect(error).toBeInstanceOf(ConflictException);
      });
  });

  it('update => should update user', async () => {
    const id: number = idUser;
    const [username] = randomUUID().split('-');
    const updateUserDto: UpdateUserDto = {
      username,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
    };

    const result: Result = new Result(
      true,
      'User updated!',
      plainToInstance(UserEntity, updateUserDto),
    );

    jest.spyOn(userServiceMock, 'update').mockResolvedValue(result);

    await request(httpServer)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateUserDto)
      .expect(HttpStatus.OK)
      .then((response) => {
        const { data } = response.body;
        expect(data).toBeInstanceOf(Object);
      });
  });

  it('delete => should delete user', async () => {
    const id: number = idUser;

    const result: Result = new Result(true, 'User deleted!');

    jest.spyOn(userServiceMock, 'delete').mockResolvedValue(result);

    await request(httpServer)
      .delete(`/users/${id}`)
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
