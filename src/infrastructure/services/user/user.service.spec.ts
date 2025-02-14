import { plainToInstance } from 'class-transformer';
import { UserService } from './user.service';
import { CryptoService } from '../crypto/crypto.service';
import { ICryptoInterface, ILogger, IUserRepository, Result } from '@core';
import { UserEntity } from '@infrastructure/entities/user.entity';
import {
  CreatedUserDto,
  CreateUserDto,
  UpdateUserDto,
} from '@infrastructure/entities/dtos/user/user.dto';

describe('UserService', () => {
  let userService: UserService;
  let loggerMock: ILogger;
  let userRepositoryMock: IUserRepository;
  let cryptoServiceMock: ICryptoInterface;

  beforeEach(() => {
    userService = {} as UserService;
    userService.findAll = jest.fn();
    userService.findOne = jest.fn();
    userService.create = jest.fn();
    userService.update = jest.fn();
    userService.delete = jest.fn();

    loggerMock = {} as ILogger;
    loggerMock.log = jest.fn();

    userRepositoryMock = {} as IUserRepository;
    userRepositoryMock.findAll = jest.fn();
    userRepositoryMock.findOne = jest.fn();
    userRepositoryMock.create = jest.fn();
    userRepositoryMock.update = jest.fn();
    userRepositoryMock.delete = jest.fn();

    cryptoServiceMock = {} as CryptoService;
    cryptoServiceMock.encrypt = jest.fn();

    userService = new UserService(
      loggerMock,
      userRepositoryMock,
      cryptoServiceMock,
    );
  });

  it('findAll => should return null if users dont exists', async () => {
    const user = {
      id: 1,
    } as UserEntity;

    const users: UserEntity[] = [user];

    jest.spyOn(userRepositoryMock, 'findAll').mockResolvedValue(users);

    const result = await userService.findAll();

    expect(userRepositoryMock.findAll).toHaveBeenCalled();

    expect(result).toEqual(
      new Result(true, 'Users found!', plainToInstance(UserEntity, users)),
    );
  });

  it('findOne => should return object if exists user by id', async () => {
    const id: number = 1;
    const user = {
      id,
    } as UserEntity | null;

    jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValue(user);

    const result = await userService.findOne(id);

    expect(userRepositoryMock.findOne).toHaveBeenCalled();
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith(id);

    expect(result).toEqual(
      new Result(true, 'User found!', plainToInstance(UserEntity, user)),
    );
  });

  it('create => should create a new user and return data', async () => {
    const createUserDto: CreateUserDto = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastname',
      email: 'email@email.com',
      password: '123456',
    };

    const createdUserDto: CreatedUserDto = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastname',
      email: 'email@email.com',
      password: '123456',
    };

    const password: string = '123456';

    jest
      .spyOn(cryptoServiceMock, 'encrypt').mockReturnValue(password);
    jest
      .spyOn(userRepositoryMock, 'create')
      .mockResolvedValue(createdUserDto as UserEntity);

    const result = await userService.create(createUserDto);

    expect(userRepositoryMock.create).toHaveBeenCalled();
    expect(userRepositoryMock.create).toHaveBeenCalledWith(createUserDto);

    expect(result).toEqual(
      new Result(
        true,
        'User created!',
        plainToInstance(CreatedUserDto, createUserDto),
      ),
    );
  });

  it('update => should update a user by id', async () => {
    const id = 1;
    const updateUserDto: UpdateUserDto = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastname',
      email: 'email@email.com',
    };

    jest.spyOn(userRepositoryMock, 'update');

    const result = await userService.update(id, updateUserDto);

    expect(userRepositoryMock.update).toHaveBeenCalled();
    expect(userRepositoryMock.update).toHaveBeenCalledWith(id, updateUserDto);

    expect(result).toEqual(new Result(true, 'User updated!', updateUserDto));
  });

  it('remove => should delete a user by id', async () => {
    const id = 1;

    jest.spyOn(userRepositoryMock, 'delete');

    const result = await userService.delete(id);

    expect(userRepositoryMock.delete).toHaveBeenCalled();
    expect(userRepositoryMock.delete).toHaveBeenCalledWith(id);

    expect(result).toEqual(new Result(true, 'User deleted!'));
  });
});
