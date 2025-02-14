import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './jwt.service';
import { JwtPayload } from '@core';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', async () => {
    expect(TokenService).toBeDefined();
  });

  it('createToken => should return token', async () => {
    const jwtPayload = {
      publicId: 'publicId',
      name: 'name',
    };

    (jwtService.signAsync as jest.Mock).mockResolvedValue(jwtPayload);
    const response = await tokenService.createToken<JwtPayload>(jwtPayload);

    expect(response).toEqual(jwtPayload);
    //expect(response).toHaveBeenCalledWith();
  });

  it('checkToken => should verify correct token', async () => {
    const token: string = 'token';

    const isValid = true;
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(isValid);

    expect(await tokenService.checkToken(token)).toEqual(isValid);
  });
});
