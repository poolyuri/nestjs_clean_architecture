import { CreateUserDto, UpdateUserDto } from "@infrastructure/entities/dtos/user/user.dto";
import { Result } from "@core";

export const USER_PORT_SERVICE = 'UserPortService';

export interface IUserServiceInterface {
  findAll(): Promise<Result>;
  findOne(id: number): Promise<Result>;
  create(createUserDto: CreateUserDto): Promise<Result>;
  update(id: number, updateUserDto: UpdateUserDto): Promise<Result>;
  delete(id: number): Promise<Result>;
}