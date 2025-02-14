
import { AuthDto } from "@infrastructure/entities/dtos/auth/auth.dto";
import { Result } from "@core";

export const AUTH_PORT_SERVICE = 'authPortService';

export interface IAuthServiceInterface {
  login(authDto: AuthDto): Promise<Result>;
  isValidToken(token: string): Promise<Result>;
}
