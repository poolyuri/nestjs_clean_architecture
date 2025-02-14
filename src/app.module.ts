import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from '@infrastructure/config/database.module';
import { AuthModule } from '@infrastructure/services/auth/auth.module';
import { UserModule } from '@infrastructure/services/user/user.module';
import { LocalStrategy } from '@infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from '@infrastructure/common/strategies/jwt.strategy';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { TodoModule } from '@infrastructure/services/todo/todo.module';

@Module({
  imports: [
    DatabaseConfigModule,
    LoggerModule,
    AuthModule,
    UserModule,
    TodoModule
  ],
  providers: [LocalStrategy, JwtStrategy]
})
export class AppModule {}
