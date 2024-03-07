import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  getI18nContextFromArgumentsHost,
  I18nValidationException,
} from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const i18n = getI18nContextFromArgumentsHost(host);
    const statusCode = exception.getStatus();
    const httpResponse = exception.getResponse();

    const responseBody = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    let message: string[] | string | undefined;
    if (exception instanceof I18nValidationException) {
      message = exception.errors
        .map((e) =>
          Object.values(e.constraints).map((c) => {
            const messageIdentifier = c.split('|')[0];
            const constraint =
              c.split('|').length > 1
                ? JSON.parse(c.split('|')[1])?.constraints
                : '';
            return i18n?.t(messageIdentifier, {
              args: { property: e.property, constraint },
            });
          }),
        )
        .join(',')
        .split(',');
    }

    if (exception instanceof HttpException) {
      return response.status(statusCode).json({
        ...responseBody,
        error: httpResponse,
        message,
      });
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      ...responseBody,
      ...(typeof httpResponse === 'object' && httpResponse),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
