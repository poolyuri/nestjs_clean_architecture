import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from '@infrastructure/entities/user.entity';
import {
  CreatedUserDto,
  CreateUserDto,
  UpdateUserDto,
} from '@infrastructure/entities/dtos/user/user.dto';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userRepositoryToken: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
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

    userRepository = module.get<UserRepository>(UserRepository);
    userRepositoryToken = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', async () => {
    expect(UserRepository).toBeDefined();
  });

  it('findAll => should return null if users dont exists', async () => {
    const user = {
      id: 1,
    } as UserEntity;

    const users: UserEntity[] = [user];

    jest.spyOn(userRepositoryToken, 'find').mockResolvedValue(users);

    const result = await userRepository.findAll();

    expect(userRepositoryToken.find).toHaveBeenCalled();
    
    expect(result).toEqual(users);
  });

  it('findOne => should return null if user by id does not exist', async () => {
    const id: number = 1;

    jest.spyOn(userRepositoryToken, 'findOneBy').mockResolvedValue(null);

    const result = await userRepository.findOne(id);

    expect(userRepositoryToken.findOneBy).toHaveBeenCalled();
    expect(userRepositoryToken.findOneBy).toHaveBeenCalledWith({ id });
    
    expect(result).toBe(null);
  });

  it('findOne => should return object if exists user by id', async () => {
    const id: number = 1;
    const user = {
      id,
    } as UserEntity | null;

    jest
      .spyOn(userRepositoryToken, 'findOneBy')
      .mockResolvedValue(user);

    const result = await userRepository.findOne(id);

    expect(userRepositoryToken.findOneBy).toHaveBeenCalled();
    expect(userRepositoryToken.findOneBy).toHaveBeenCalledWith({ id });
    
    expect(result).toEqual(user);
  });

  it('create => should create a new user and return its data', async () => {
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

    jest.spyOn(userRepositoryToken, 'save').mockResolvedValue(createdUserDto as UserEntity);

    const result = await userRepository.create(createUserDto);

    expect(userRepositoryToken.save).toHaveBeenCalled();
    expect(userRepositoryToken.save).toHaveBeenCalledWith(createUserDto);

    expect(result).toEqual(createdUserDto);
  });

  it('update => should update a user by id', async () => {
    const id = 1;

    const updateUserDto: UpdateUserDto = {
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastname',
      email: 'email@email.com',
    };

    jest.spyOn(userRepositoryToken, 'update');

    const result = await userRepository.update(id, updateUserDto);

    expect(userRepositoryToken.update).toHaveBeenCalled();
    expect(userRepositoryToken.update).toHaveBeenCalledWith(id, updateUserDto);

    expect(result).toBe(void 0);
  });

  it('remove => should delete a user by id', async () => {
    const id = 1;
    jest.spyOn(userRepositoryToken, 'delete');

    const result = await userRepository.delete(id);

    expect(userRepositoryToken.delete).toHaveBeenCalled();
    expect(userRepositoryToken.delete).toHaveBeenCalledWith(id);

    expect(result).toBe(void 0);
  });
});
