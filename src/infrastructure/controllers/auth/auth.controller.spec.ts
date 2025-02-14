import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';
import { AuthController } from './auth.controller';
import {
  AuthDto,
  PayloadToken,
} from '@infrastructure/entities/dtos/auth/auth.dto';
import { IAuthServiceInterface, Result } from '@core';

describe('AuthController', () => {
  let app: INestApplication;

  let controller: AuthController;
  let authServiceMock: IAuthServiceInterface;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let httpServer: any;
  let token: string;

  beforeAll(async () => {
    authServiceMock = {} as IAuthServiceInterface;
    authServiceMock.login = jest.fn();
    authServiceMock.isValidToken = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    controller = module.get<AuthController>(AuthController);
    httpServer = app.getHttpServer();

    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login => should login success', async () => {
    const authDto: AuthDto = {
      username: 'poolyuri',
      password: '123456',
    };

    await request(httpServer)
      .post('/auth/login')
      .send(authDto)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        token = response.body.data.token;
        expect(response.body).toEqual(
          new Result(true, 'Successfully login!', { token }),
        );
      });
  });

  it('login => should login - incorrect username', async () => {
    const authDto: AuthDto = {
      username: 'kano-belcan',
      password: '123456',
    };

    await request(httpServer)
      .post('/auth/login')
      .send(authDto)
      .expect(HttpStatus.UNAUTHORIZED)
      .then((response) => {
        expect(response.body).toEqual({
          success: false,
          message: 'Incorrect username!',
        });
      });
  });

  it('login => should login - incorrect password', async () => {
    const authDto: AuthDto = {
      username: 'poolyuri',
      password: '99999999',
    };

    await request(httpServer)
      .post('/auth/login')
      .send(authDto)
      .expect(HttpStatus.UNAUTHORIZED)
      .then((response) => {
        expect(response.body).toEqual({
          success: false,
          message: 'Incorrect password!',
        });
      });
  });

  it('validateToken => should validate token', async () => {
    const payload: PayloadToken = {
      token,
    };

    const result: Result = new Result(true, 'Valid token');

    (authServiceMock.isValidToken as jest.Mock).mockResolvedValue(result);

    await request(httpServer)
      .post('/auth/validateToken')
      .send(payload)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(result);
      });
  });

  it('validateToken => should token expired', async () => {
    const payload: PayloadToken = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImRhdGEiOnsicHVibGljSWQiOiJwb29seXVyaTYiLCJuYW1lIjoiUG9vbCBZdXJpdmlsY2EgQWxhbmlhIn19LCJpYXQiOjE3MzkzMTc5NTgsImV4cCI6MTczOTMyMTU1OH0.3l0aW-EExy0YrFZq649CSVswwW_zKm-fsJZ5WNUwdtQ',
    };

    const result: Result = new Result(false, 'Invalid token');

    (authServiceMock.isValidToken as jest.Mock).mockResolvedValue(result);

    await request(httpServer)
      .post('/auth/validateToken')
      .send(payload)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(result);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
