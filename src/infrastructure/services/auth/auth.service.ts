import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '@infrastructure/entities/dtos/auth/auth.dto';
import { UserEntity } from '@infrastructure/entities/user.entity';
import {
  IAuthRepository,
  IAuthServiceInterface,
  ICryptoInterface,
  ILogger,
  ITokenInterface,
  JwtPayload,
  Result,
} from '@core';

@Injectable()
export class AuthService implements IAuthServiceInterface {
  constructor(
    private readonly logger: ILogger,
    private readonly authRepository: IAuthRepository,
    private readonly cryptoService: ICryptoInterface,
    private readonly jwtService: ITokenInterface,
  ) {}

  async login(authDto: AuthDto): Promise<Result> {
    const user: UserEntity | null =
      await this.authRepository.findUserByUsername(authDto.username);

    if (!user) {
      throw new UnauthorizedException(new Result(false, 'Incorrect username!'));
    }

    const isValidPass: boolean = this.cryptoService.verify(
      user?.password,
      authDto.password,
    );

    if (!isValidPass) {
      throw new UnauthorizedException(new Result(false, 'Incorrect password!'));
    }

    const token: string = await this.jwtService.createToken<JwtPayload>({
      publicId: user.username,
      name: `${user.firstName} ${user.lastName}`
    });

    this.logger.log(
      AuthService.name,
      `the user ${authDto.username} have been logged`,
    );
    return new Result(true, 'Successfully login!', { token });
  }

  async isValidToken(token: string): Promise<Result> {
    const isValid: boolean = await this.jwtService.checkToken(token);
    return new Result(isValid, isValid ? 'Valid token' : 'Invalid token');
  }
}
