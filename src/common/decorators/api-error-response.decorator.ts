import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

interface IApiErrorResponse {
  status: number;
  message: string;
  errorType: string;
  path: string;
}

export const ApiErrorResponse = (errors: IApiErrorResponse[]) => {
  return applyDecorators(
    ...errors.map(({ status, message, errorType, path }) =>
      ApiResponse({
        status: status,
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: status },
            timestamp: { type: 'string', format: 'date-time' },
            path: { type: 'string', example: `/v1/${path}` },
            message: { type: 'string', example: message },
            error: { type: 'string', example: errorType },
          },
        },
      }),
    ),
  );
};
