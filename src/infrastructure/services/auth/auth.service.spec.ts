import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from '@infrastructure/entities/dtos/auth/auth.dto';
import { UserEntity } from '@infrastructure/entities/user.entity';
import { IAuthRepository, ICryptoInterface, ILogger, ITokenInterface, Result } from '@core';
import { plainToInstance } from 'class-transformer';

describe('AuthService', () => {
  let authService: AuthService;
  let loggerMock: ILogger;
  let authRepositoryMock: IAuthRepository;
  let cryptoServiceMock: ICryptoInterface;
  let tokenService: ITokenInterface;

  beforeEach(() => {
    authService = {} as AuthService;
    authService.login = jest.fn();
    authService.isValidToken = jest.fn();

    loggerMock = {} as ILogger;
    loggerMock.log = jest.fn();

    authRepositoryMock = {} as IAuthRepository;
    authRepositoryMock.findUserByUsername = jest.fn();

    cryptoServiceMock = {} as ICryptoInterface;
    cryptoServiceMock.verify = jest.fn();

    tokenService = {} as ITokenInterface;
    tokenService.createToken = jest.fn();
    tokenService.checkToken = jest.fn();

    authService = new AuthService(
      loggerMock,
      authRepositoryMock,
      cryptoServiceMock,
      tokenService,
    );
  });

  it('login => should sign in a user and return an access token', async () => {
    const authDto: AuthDto = {
      username: 'username',
      password: 'password',
    };

    const user = {
      id: 1,
    } as UserEntity;

    const token = 'token';

    (authRepositoryMock.findUserByUsername as jest.Mock).mockResolvedValue(
      () => user,
    );
    (cryptoServiceMock.verify as jest.Mock).mockReturnValue(() => true);
    (tokenService.createToken as jest.Mock).mockResolvedValue(token);

    expect(await authService.login(plainToInstance(AuthDto, authDto))).toEqual(
      new Result(true, 'Successfully login!', {
        token,
      }),
    );
  });

  it('login => should throw an UnauthorizedException if the user is incorrect', async () => {
    const authDto: AuthDto = {
      username: 'username',
      password: 'password',
    };

    jest
      .spyOn(authRepositoryMock, 'findUserByUsername')
      .mockResolvedValueOnce(null);

    await expect(authService.login(plainToInstance(AuthDto, authDto))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('login => should throw an UnauthorizedException if the password is incorrect', async () => {
    const authDto: AuthDto = {
      username: 'username',
      password: 'password',
    };

    const user = {
      id: 1,
      password: '123456',
    } as UserEntity;

    const isValidPass = false;

    (authRepositoryMock.findUserByUsername as jest.Mock).mockResolvedValue(
      () => user,
    );
    (cryptoServiceMock.verify as jest.Mock).mockReturnValue(isValidPass);

    await expect(authService.login(plainToInstance(AuthDto, authDto))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('isValidToken => should return boolean value true if token is valid', async () => {
    const token: string = 'token';

    const isValid = true;
    (tokenService.checkToken as jest.Mock).mockResolvedValue(isValid);

    expect(await authService.isValidToken(token)).toEqual(
      new Result(isValid, 'Valid token'),
    );
  });

  it('isValidToken => should return boolean value false if token is valid', async () => {
    const token: string = 'token';

    const isValid = false;
    (tokenService.checkToken as jest.Mock).mockResolvedValue(isValid);

    expect(await authService.isValidToken(token)).toEqual(
      new Result(isValid, 'Invalid token'),
    );
  });
});
