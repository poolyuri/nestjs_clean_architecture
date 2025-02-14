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