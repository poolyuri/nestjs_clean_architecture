import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CryptoService } from "../crypto/crypto.service";
import { UsersController } from "@infrastructure/controllers/users/users.controller";
import { UserServiceProvider } from "@infrastructure/providers/user.provider";
import { UserRepository } from "@infrastructure/repositories/user.repository";
import { UserEntity } from "@infrastructure/entities/user.entity";
import { LoggerService } from "@infrastructure/logger/logger.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    LoggerService,
    UserRepository,
    CryptoService,
    UserServiceProvider
  ],
  exports: [
    UserRepository
  ]
})
export class UserModule {}