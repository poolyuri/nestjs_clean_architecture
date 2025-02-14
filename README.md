<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# <center>**NestJS | Clean Architecture**</center>

## ¿Qué es la arquitectura limpia?

La arquitectura limpia es una filosofía de diseño de software que separa los elementos de un diseño en niveles de anillo. Un objetivo importante de la arquitectura limpia es proporcionar a los desarrolladores una forma de organizar el código de tal manera que encapsule la lógica de negocios y la mantenga separada del mecanismo de entrega.

<p>
  <a href="">
    <img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*2nqUx2LoWvC2sK91HVZcFQ.png" />
  </a>
</p>

Los principios de diseño de código (SOLID) son una parte importante en la arquitectura limpia.

- **Single responsibility principle** (*Principio de responsabilidad única*): Una clase debe tener una, y sólo una, razón para cambiar. O la nueva versión: un módulo debe ser responsable ante un solo actor.
- **Open-closed principle** (*Principio de apertura-cierre*): Una clase debe estar abierta para la extensión,pero cerrada para la modificación.
- **Liskov's substitution principle** (*Principio de sustitución de Liskov*): Los objetos de un programa deben ser reemplazables por instancias de sus subtipos sin alterar la corrección de ese programa.
- **Interface segregation principle** (*Principio de segregación de interfaces*): Muchas interfaces específicas del cliente son mejores que una interfaz de propósito general.
- **Dependency inversion principle** (*Principio de inversión de dependencias*): se debe depender de abstracciones, no de concreciones.

## ¿Qué es NestJS?

Es un framework de desarrollo de lado de servidor que crea aplicaciones eficientes y escalables. Esta basado en NodeJS y usa TypeScript como lenguaje de programación. Utiliza marcos de servidor HTTP robustos como Express o Fastify.

Para explorar más a fondo les recomiendo visitar la documentación de [**NestJS**](https://docs.nestjs.com/) que está muy detallada y completa.

## ¿Por qué elegir NestJS y la Clean Architecture?

Sobre NestJS, tiene posibilidad de crear aplicaciones robustas backend usando TypeScript y definitivamente la documentación está realmente completa.\
En cuanto a la arquitectura que se detalla en la documentación, a mi parecer no era la mejor opción; ya que, si bien los marcos y especificaciones a lo largo de un proyecto van cambiando, esta no tiene el nivel de escalabilidad que se necesita en un proyecto grande. Por esta razón, estoy incluyendo la arquitectura limpia en modo de solucionar dicho problema.

## 1. Instalación

Instala el [**CLI**](https://docs.nestjs.com/first-steps) de Nest si aún no la tienes y crea un nuevo proyecto

```bash
$ nest new project-name
```
![Instalación](/images/1_installation.png)

Retire **app.service.ts** y **app.controller.ts**

Hay 2 carpetas principales: **core** e **infrastructure**.

**- Core**: Contiene el código del negocio y su lógica, no tiene depenencia externa de frameworks, ni de paquetes externos.\
**- Infrastructure**: Contiene los detalles técnicos, configuración, implementación (BD, servicios web, módulos, etc.)

![Instalación](/images/2_folders.png)

## 2. Codificación

En este punto se detallarán las tareas básicas en forma breve; ya que, mucha de la información se encuentra dentro de la documentación de NestJS.

### 2.1 Configuración

Instalar <code>@nestjs/config</code>

```bash
npm i --save @nestjs/config
```

Ejecute el siguiente comando para generar un módulo y servicio.

```bash
nest g mo /infrastructure/config/environment
nest g s /infrastructure/common/strategies/environment-strategy
```

Crea una "interfaz" dentro de la carpeta **/core/config/**

```typescript
export interface DatabaseConfig {
  getDatabaseHost(): string;
  getDatabasePort(): number;
  getDatabaseUser(): string;
  getDatabasePassword(): string;
  getDatabaseName(): string;
  getDatabaseSync(): boolean;
}
```

Instalar <code>joi</code>

```bash
npm i joi
```
Crear un archivo de validación en la siguiente ruta **/infrastructure/congig/validation.config.ts** con el siguiente código

```typescript
import * as Joi from 'joi';

export const validationConfig = Joi.object({
  NODE_ENV: Joi.string().valid(
    'development', 
    'certification', 
    'production'
  ).default('development'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  PORT: Joi.number().default(3000),
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().default(3306),
  MYSQL_USERNAME: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),
  MYSQL_SYNCHRONIZE: Joi.bool().required(),
  CRYPTO_KEY: Joi.string().required()
});
```

Crear un archivo de configuración en la siguiente ruta **/infrastructure/congig/enviroment.config.ts** con el siguiente código

```typescript
export const enviromentConfig = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: process.env.MYSQL_SYNCHRONIZE,
  },
  crypto: process.env.CRYPTO_KEY
});
```

Dentro del servicio creado **/infrastructure/common/strategies/enviroment.strategy.ts** implementar la siguiente interfaz

```typescript
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
```

Instalar <code>@nestjs/typeorm</code>, en cualquier caso, puedes usar la base de datos de tu preferencia, en mi caso estoy usando **MySQL**

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

Se debe crear un módulo en la ruta **/infrastructure/config/** 

```bash
nest g mo /infrastructure/config/database
```

```typescript
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
```

Cambiar **start:dev** en <code>package.json</code>

```json
"start:dev": "NODE_ENV=development nest start --watch"
```

### 2.2 Entidad

Los archivos de entidaes se encuentra dentro de la carpeta **/infrastructure**, esto se debe a que entidad usa módulos externos

```typescript
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn()
  @Index({ unique: true })
  id: number;

  @Column('varchar')
  name: string;

  @Column('boolean')
  isDone: boolean;
}
```

### 2.3 Logger

Todas las aplicaciones usan un Logger, por ejemplo, los proveedores de servicios en la nube (AWS, Azure, GCP, etc) usan diferentes loggers. Personalizarlo puede ser un poco tedioso; es por esta razón, que estoy usando un módulo con una interfaz para abstraer este problema a mi lógica y no depender de un proveedor externo.

```bash
nest g mo /infrastructure/logger
nest g s /infrastructure/logger
```

Generar la interfaz dentro de la carpeta **/core/logger**

```typescript
export interface ILogger {
  debug(context: string, message: string): void;
  log(context: string, message: string): void;
  error(context: string, message: string, trace?: string): void;
  warn(context: string, message: string): void;
  verbose(context: string, message: string): void;
}
```

En este caso se esta usando un logger abstracto, se puede cambiar facilmente si es necesario

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '@core';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }
  log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context);
  }
  error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
  }
  warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
  }
  verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
```

### 2.4 Filters

Si bien los filtros vienen incorporados en NestJS, en este caso estoy usando uno personalizado para tener un control total sobre la capa de excepciones.

```typescript
import { 
  ArgumentsHost, 
  Catch, 
  ExceptionFilter, 
  HttpException, 
  HttpStatus 
} from "@nestjs/common";
import { Request, Response } from 'express';
import { LoggerService } from "@infrastructure/logger/logger.service";
import { IErrorResponse } from "@core";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: number = exception instanceof HttpException ? 
      exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IErrorResponse)
        : { message: (exception as Error).message, error_code: null };

    const responseData = {
      ...{
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      ...message,
    };

    this.logMessage(request, message, status, exception);

    response.status(status).send(responseData);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logMessage(request: Request, message: IErrorResponse, status: number, exception: any) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.url}`,
        `method=${request.method} status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}`,
        status >= 500 ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `End Request for ${request.url}`,
        `method=${request.method} status=${status} code_error=${
          message.code_error ? message.code_error : null
        } message=${message.message ? message.message : null}`,
      );
    }
  }
}
```

Agregar esta linea en tu **main.ts**

```typescript
app.useGlobalFilters(new HttpExceptionFilter(new LoggerService()));
```

### 2.5 Interceptors

Este interceptor maneja la solicitud HTTP entrante.\
Para leer más sobre "interceptors" puede leer la documentación de NodeJS.

```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();

    this.logger.log(`Incoming Request on ${request.url}`, `method=${request.method}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`End Request for ${request.url}`, `method=${request.method} duration=${Date.now() - now}ms`);
      }),
    );
  }
}
```

Agregar esta linea de código en tu **main.ts**

```typescript
app.useGlobalInterceptors(new LoggerInterceptor(new LoggerService()));
```

### 2.6 Repositories

En primer lugar, necesitaremos una interfaz en la ruta **/core/ports** generar abstraer el repositorio. Si en algún momento quieres cambiar tu ORM o tu BD no habrá problema

```typescript
import { CreateTodoDto, UpdateTodoDto } from "@infrastructure/entities/dtos/todo/todo.dto";
import { Result } from "@core";

export const TODO_PORT_SERVICE = 'TodoPortService';

export interface ITodoServiceInterface {
  findAll(): Promise<Result>;
  findOne(id: number): Promise<Result>;
  create(createTodoDto: CreateTodoDto): Promise<Result>;
  update(id: number, updateTodoDto: UpdateTodoDto): Promise<Result>;
  delete(id: number): Promise<Result>;
}
```

Dentro de la carpeta **/infrastructure/repositories** crear el archivo <code>todo.repository.ts</code>

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TodoEntity } from "../entities/todo.entity";
import { CreateTodoDto, CreatedTodoDto, UpdateTodoDto } from "../entities/dtos/todo/todo.dto";
import { ITodoRepository } from "@core";

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly userRepository: Repository<TodoEntity>
  ) {}

  async findAll(): Promise<TodoEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<TodoEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(createTodoDto: CreateTodoDto): Promise<CreatedTodoDto> {
    return await this.userRepository.save(createTodoDto);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<void> {
    await this.userRepository.update(id, updateTodoDto);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
```

### 2.7 Service Providers

Este archivo que se crea en la carpeta **/infrastructure/providers** será el enlace entre los casos de uso y su infraestructura, este inyectará los diferentes servicios necesarios para cada uno de ellos. De esta manera será fácil cambiar el servicio en el futuro y este respetará la inyección de dependencias (SOLID).

```typescript
import { TodoRepository } from '../repositories/todo.repository';
import { TodoService } from '../services/todo/todo.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { TODO_PORT_SERVICE } from '@core';

export const TodoServiceProvider = {
  inject: [LoggerService, TodoRepository],
  provide: TODO_PORT_SERVICE,
  useFactory: (
    loggerService: LoggerService,
    todoRepository: TodoRepository
  ) => new TodoService(loggerService, todoRepository),
};
```

### 2.8 Casos de uso

En mi arquitectura, suelo crear un servicio (use cases) por cada entidad. Al ser un código monolítico y deseamos cambiar de base de datos, cada servicio será una función diferente (lambda, azure function, GCP, firebase functions, etc).

```bash
nest g mo /infrastructure/services/todo
nest g s /infrastructure/services/todo
```

```typescript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodosController } from "@infrastructure/controllers/todos/todos.controller";
import { TodoServiceProvider } from "@infrastructure/providers/todo.provider";
import { TodoRepository } from "@infrastructure/repositories/todo.repository";
import { TodoEntity } from "@infrastructure/entities/todo.entity";
import { LoggerService } from "@infrastructure/logger/logger.service";

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodosController],
  providers: [
    LoggerService,
    TodoRepository,
    TodoServiceProvider
  ],
  exports: [
    TodoRepository
  ]
})
export class TodoModule {}
```

```typescript
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreatedTodoDto, CreateTodoDto, UpdateTodoDto } from '../../entities/dtos/todo/todo.dto';
import { TodoEntity } from '../../entities/todo.entity';
import { ILogger, ITodoRepository, ITodoServiceInterface, Result } from '@core';

@Injectable()
export class TodoService implements ITodoServiceInterface {
  constructor(
    private readonly logger: ILogger,
    private readonly todoRepository: ITodoRepository
  ) {}

  async findAll(): Promise<Result> {
    const todos: TodoEntity[] = await this.todoRepository.findAll();
    return new Result(true, 'Todos found!', plainToInstance(TodoEntity, todos));
  }

  async findOne(id: number): Promise<Result> {
    const todo: TodoEntity | null = await this.todoRepository.findOne(id);
    return new Result(true, 'Todo found!', plainToInstance(TodoEntity, todo));
  }

  async create(createTodoDto: CreateTodoDto): Promise<Result> {
    const todo: CreateTodoDto = await this.todoRepository.create(createTodoDto);

    this.logger.log(TodoService.name, 'new todo have been inserted');
    return new Result(true, 'Todo created!', plainToInstance(CreatedTodoDto, todo));
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Result> {
    const updateTodo = plainToInstance(TodoEntity, updateTodoDto);    
    await this.todoRepository.update(id, updateTodo);

    this.logger.log(TodoService.name, 'todo have been updated');
    return new Result(true, 'Todo updated!', updateTodo);
  }

  async delete(id: number): Promise<Result> {
    await this.todoRepository.delete(id);

    this.logger.log(TodoService.name, 'todo have been eleted');
    return new Result(true, 'Todo deleted!');
  }
}
```

### 2.9 Controllers

Los controladores se crean en la carpeta **/infrastructure/controllers** y estas llaman al caso de uso. Se debe mantener un código claro y simple.

```typescript
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TodoEntity } from '../../entities/todo.entity';
import { CreateTodoDto, UpdateTodoDto } from '../../entities/dtos/todo/todo.dto';
import { JwtAuthGuard } from '@infrastructure/common/guards/auth.guard';
import { ITodoServiceInterface, TODO_PORT_SERVICE, Result } from '@core';

@Controller('todos')
@ApiResponse({ status: 401, description: 'No authorization token was found' })
@ApiResponse({ status: 500, description: 'Internal error' })
export class TodosController {
  constructor(
    @Inject(TODO_PORT_SERVICE)
    private readonly todoServiceInterface: ITodoServiceInterface
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ description: "Find all todos", type: Array<TodoEntity> })
  @ApiOperation({ summary: 'Find all todos' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Result> {
    return await this.todoServiceInterface.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Find todo", type: TodoEntity })
  @ApiOperation({ summary: 'Find todo' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Result> {    
    return await this.todoServiceInterface.findOne(id);
  }

  @ApiResponse({ description: "Create todo", type: CreateTodoDto })
  @ApiOperation({ summary: 'Create todo' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todoServiceInterface.create(createTodoDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Update todo", type: UpdateTodoDto })
  @ApiOperation({ summary: 'Update todo' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todoServiceInterface.update(id, updateTodoDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Delete todo", type: [Number] })
  @ApiOperation({ summary: 'Delete todo' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.todoServiceInterface.delete(id);
  }
}
```

### 2.10 DTO

Los DTO (data transfer object) son los datos e entrada para el controlador, serán los datos que se muestran en el **swagger* y los datos verificados antes de su uso.

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isDone: boolean;
};

export class CreatedTodoDto extends CreateTodoDto {};
export class UpdateTodoDto extends CreateTodoDto {};
```

# Conclusión

El código es bastante extenso, no he cubierto todos los patrones, pero puedes encontrar la arquitectura completa en este repositorio. Finalmente, con esta arquitectura todo se puede cambiar fácilmente.\
Esta solución incluye las pruebas unitarias con Jest y también pruebas de Covertura.

**Unit Test**

![Instalación](/images/3_unit-test.png)

**Coverage Test**

![Instalación](/images/4_coverage-test.png)

# <center>**Project Setup**</center>

```bash
$ npm install
```

## Compile and run the project

```bash

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test:watch

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.