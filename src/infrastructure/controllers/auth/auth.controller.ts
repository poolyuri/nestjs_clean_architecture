import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '@infrastructure/common/guards/local-auth.guard';
import { AuthDto, PayloadToken } from '@infrastructure/entities/dtos/auth/auth.dto';
import { AUTH_PORT_SERVICE, IAuthServiceInterface, Result } from '@core';

@Controller('auth')
@ApiResponse({ status: 500, description: 'Internal error' })
export class AuthController {
  constructor(
    @Inject(AUTH_PORT_SERVICE)
    private readonly authServiceInterface: IAuthServiceInterface
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: AuthDto })
  @ApiOperation({ summary: 'Login user into the system' })
  async login(@Body() authDto: AuthDto): Promise<HttpException | Result> {
    const result: HttpException | Result = await this.authServiceInterface.login(authDto);
    return result;
  }

  @Post('/validateToken')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify token' })
  async validate(@Body() payload: PayloadToken): Promise<Result> {
    const { token } = payload;
    
    return this.authServiceInterface.isValidToken(token);
  }
}
