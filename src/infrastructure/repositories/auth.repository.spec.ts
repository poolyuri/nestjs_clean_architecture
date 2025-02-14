import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@infrastructure/entities/user.entity';
import { AuthRepository } from './auth.repository';
import { Repository } from 'typeorm';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let userRepositoryToken: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
    userRepositoryToken = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', async () => {
    expect(AuthRepository).toBeDefined();
  });

  it('findUserByUsername => should return null if user by username does not exist', async () => {
    const username = 'poolyuri';

    jest.spyOn(userRepositoryToken, 'findOneBy').mockResolvedValue(null);

    const result = await authRepository.findUserByUsername(username);

    expect(userRepositoryToken.findOneBy).toHaveBeenCalled();
    expect(userRepositoryToken.findOneBy).toHaveBeenCalledWith({ username });

    expect(result).toBe(null);
  });

  it('findUserByUsername => should return object if exists user by username', async () => {
    const username: string = 'poolyuri';
    const user = {
      username,
    } as UserEntity;

    jest.spyOn(userRepositoryToken, 'findOneBy').mockResolvedValue(user);

    const result = await authRepository.findUserByUsername(username);

    expect(userRepositoryToken.findOneBy).toHaveBeenCalled();
    expect(userRepositoryToken.findOneBy).toHaveBeenCalledWith({ username });

    expect(result).toEqual(user);
  });
});
