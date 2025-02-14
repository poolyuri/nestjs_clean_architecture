import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DatabaseConfig, JWTConfig } from "@core";

@Injectable()
export class EnviromentStrategy implements DatabaseConfig, JWTConfig {

  constructor(
    private readonly configService: ConfigService
  ) {}

  getJwtSecret(): string {
    return this.configService.get<string>('jwt.secret') || '';
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('jwt.expiresIn') || '';
  }

  getDatabaseHost(): string {
    return this.configService.get<string>('mysql.host') || '';
  }
  
  getDatabasePort(): number {
    return this.configService.get<number>('mysql.port') || 3306;
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('mysql.username') || '';
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('mysql.password') || '';
  }

  getDatabaseName(): string {
    return this.configService.get<string>('mysql.database') || '';
  }

  getDatabaseSync(): boolean {
    return this.configService.get<boolean>('mysql.synchronize') || false;
  }
}