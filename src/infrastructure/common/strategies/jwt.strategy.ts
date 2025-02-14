import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@core';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { AuthRepository } from '@infrastructure/repositories/auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly logger: LoggerService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || ''
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(payload: any): Promise<boolean> {
    const { publicId } = payload.data as JwtPayload;
    const user = await this.authRepository.findUserByUsername(publicId);
    
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found`);
      throw new UnauthorizedException();
    }

    return true;
  }
}
