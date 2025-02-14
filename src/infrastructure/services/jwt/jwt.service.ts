import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ITokenInterface } from "@core";

@Injectable()
export class TokenService implements ITokenInterface {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async createToken<T>(data: T): Promise<string> {
    return await this.jwtService.signAsync({ data });
  }

  async checkToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
    
    return true;
  }
}