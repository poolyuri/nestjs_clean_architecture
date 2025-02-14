import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { LoggerInterceptor } from '@infrastructure/common/interceptors/logger.interceptor';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { HttpExceptionFilter } from '@infrastructure/common/filters/exception.filter';
import { Result } from '@core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: false
    }),
  );

  registerGlobals(app);

  // filters
  app.useGlobalFilters(new HttpExceptionFilter(new LoggerService()));

  // interceptors
  app.useGlobalInterceptors(new LoggerInterceptor(new LoggerService()));

  // swagger config
  if (process.env.NODE_ENV !== 'production') {
    const swgDesc = `This project with NestJs shows what it would be like to work with a 
    Clean Architecture and Domain-Driven Design (DDD).`;

    const config = new DocumentBuilder()
      .setTitle('NestJS API - OpenAPI 3.0')
      .setDescription(swgDesc)
      .setVersion('1.0')
      .setExternalDoc('NodeJs - Clean Architecture Repository', 'https://github.com/poolyuri/nestjs_clean_architecture')
      .addTag('API')
      .addServer(`http://localhost:${process.env.PORT ?? 3000}`)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Input your JWT token',
          name: 'Authorization',
          in: 'header',
        },
        'bearer',
      )
      .setContact('the developer', '', 'poolyuri@gmail.com')
      .build();

      SwaggerModule.setup('api', app, 
        () => SwaggerModule.createDocument(app, config, {
          extraModels: [Result]
        }), 
        {
          swaggerOptions: {
            security: [{ 'bearer': [] }],
          },
        }
      );
  }

  await app.listen(process.env.PORT ?? 3000);
}

export function registerGlobals(app: INestApplication) {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)));
}

bootstrap();
