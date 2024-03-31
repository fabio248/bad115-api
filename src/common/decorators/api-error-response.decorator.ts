import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

interface IApiErrorResponse {
  errors: {
    status: number;
    message: string;
    errorType: string;
    path: string;
  }[];
}

export const ApiErrorResponse = ({ errors }: IApiErrorResponse) => {
  return applyDecorators(
    ...errors.map(({ status, message, errorType, path }) =>
      ApiResponse({
        status: status,
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: status },
            message: { type: 'string', example: message },
            path: { type: 'string', example: `/v1/${path}` },
            timestamp: { type: 'string', format: 'date-time' },
            error: { type: 'string', example: errorType },
          },
        },
      }),
    ),
  );
};
