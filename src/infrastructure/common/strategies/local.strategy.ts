import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from '@infrastructure/entities/user.entity';
import { AuthRepository } from '@infrastructure/repositories/auth.repository';
import { CryptoService } from '@infrastructure/services/crypto/crypto.service';
import { Result } from '@core';
import { LoggerService } from '@infrastructure/logger/logger.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly cryptoService: CryptoService,
    private readonly logger: LoggerService
  ) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<UserEntity | null> {
    const user: UserEntity | null = await this.authRepository.findUserByUsername(username);
    
    if (!user) {
      this.logger.warn('LocalStrategy', `Incorrect username!`);
      throw new UnauthorizedException(
        new Result(false, 'Incorrect username!'),
      );
    }
    
    const isValidPass: boolean = this.cryptoService.verify(
      user?.password,
      password
    );

    if (!isValidPass) {
      this.logger.warn('LocalStrategy', `Incorrect password!`);
      throw new UnauthorizedException(
        new Result(false, 'Incorrect password!'),
      );
    }

    return user;
  }
}
