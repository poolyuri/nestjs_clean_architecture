import { UserRepository } from '../repositories/user.repository';
import { CryptoService } from '../services/crypto/crypto.service';
import { UserService } from '../services/user/user.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { USER_PORT_SERVICE } from '@core';

export const UserServiceProvider = {
  inject: [LoggerService, UserRepository, CryptoService],
  provide: USER_PORT_SERVICE,
  useFactory: (
    loggerService: LoggerService,
    userRepository: UserRepository,
    cryptoService: CryptoService,
  ) => new UserService(loggerService, userRepository, cryptoService),
};
