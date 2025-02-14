import { UserEntity } from "@infrastructure/entities/user.entity";

export interface IAuthRepository {
  findUserByUsername(username: string): Promise<UserEntity | null>;
}
