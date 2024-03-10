import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App Endpoints')
@Controller()
export class AppController {
  constructor() {}

  @ApiOperation({
    summary: 'Health',
    description: 'Use this endpoint to check the health of the API',
  })
  @Get()
  root(): { status: string; uptime: number } {
    return { status: 'ok', uptime: process.uptime() };
  }
}
