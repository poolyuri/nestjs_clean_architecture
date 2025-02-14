import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnviromentConfigModule } from './enviroment.module';
import { EnviromentStrategy } from '../common/strategies/enviroment.strategy';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnviromentConfigModule],
      inject: [EnviromentStrategy],
      useFactory: async (config: EnviromentStrategy): 
        Promise<TypeOrmModuleOptions> => ({
          type: 'mysql',
          host: config.getDatabaseHost(),
          port: config.getDatabasePort(),
          username: config.getDatabaseUser(),
          password: config.getDatabasePassword(),
          database: config.getDatabaseName(),
          entities: [__dirname + './../**/*.entity{.ts,.js}'],
          synchronize: config.getDatabaseSync()
        })
    })
  ],
  providers: [],
  exports: []
})
export class DatabaseConfigModule {}