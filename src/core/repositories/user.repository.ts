import { UserEntity } from "@infrastructure/entities/user.entity";
import { CreatedUserDto, CreateUserDto, UpdateUserDto } from '@infrastructure/entities/dtos/user/user.dto';

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findOne(id: number): Promise<UserEntity | null>;
  create(createUserDto: CreateUserDto): Promise<CreatedUserDto>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<void>;
  delete(id: number): Promise<void>;
}
