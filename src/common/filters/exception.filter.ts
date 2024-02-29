import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const httpResponse = exception.getResponse();

    const responseBody = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof HttpException) {
      return response.status(statusCode).json({
        ...responseBody,
        ...(typeof httpResponse === 'object' && httpResponse),
      });
    }

    if (typeof httpResponse === 'string') {
      return response.status(statusCode).json({
        ...responseBody,
        message: httpResponse,
      });
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      ...responseBody,
      ...(typeof httpResponse === 'object' && httpResponse),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
