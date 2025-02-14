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
