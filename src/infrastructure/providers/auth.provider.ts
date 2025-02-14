import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '../services/crypto/crypto.service';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/jwt/jwt.service';
import { AuthRepository } from '../repositories/auth.repository';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { AUTH_PORT_SERVICE } from '@core';

export const AuthServiceProvider = {
  inject: [LoggerService, AuthRepository, CryptoService, JwtService],
  provide: AUTH_PORT_SERVICE,
  useFactory: (
    loggerService: LoggerService,
    authRepository: AuthRepository,
    cryptoService: CryptoService,
    JwtService: JwtService,
  ) => new AuthService(loggerService, authRepository, cryptoService, new TokenService(JwtService))
};
