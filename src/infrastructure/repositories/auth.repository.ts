import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { IAuthRepository } from '@core';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ username: username });
  }
}
