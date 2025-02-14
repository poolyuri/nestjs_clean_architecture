import { ConflictException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreatedUserDto, CreateUserDto, UpdateUserDto } from '../../entities/dtos/user/user.dto';
import { UserEntity } from '../../entities/user.entity';
import { ICryptoInterface, ILogger, IUserRepository, IUserServiceInterface, Result } from '@core';

@Injectable()
export class UserService implements IUserServiceInterface {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: IUserRepository,
    private readonly cryptoService: ICryptoInterface
  ) {}

  async findAll(): Promise<Result> {
    const users: UserEntity[] = await this.userRepository.findAll();
    return new Result(true, 'Users found!', plainToInstance(UserEntity, users));
  }

  async findOne(id: number): Promise<Result> {
    const user: UserEntity | null = await this.userRepository.findOne(id);
    return new Result(true, 'User found!', plainToInstance(UserEntity, user));
  }

  async create(createUserDto: CreateUserDto): Promise<Result> {
    const password = this.cryptoService.encrypt(createUserDto.password);
    
    try {
      const user: CreateUserDto = await this.userRepository.create({
        ...createUserDto,
        password
      });

      this.logger.log(UserService.name, 'new user have been inserted');
      return new Result(true, 'User created!', plainToInstance(CreatedUserDto, user));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ConflictException('Already exists a user with the same username');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Result> {
    const updateUser = plainToInstance(UserEntity, updateUserDto);    
    await this.userRepository.update(id, updateUser);

    this.logger.log(UserService.name, 'user have been updated');
    return new Result(true, 'User updated!', updateUser);
  }

  async delete(id: number): Promise<Result> {
    await this.userRepository.delete(id);

    this.logger.log(UserService.name, 'user have been eleted');
    return new Result(true, 'User deleted!');
  }
}