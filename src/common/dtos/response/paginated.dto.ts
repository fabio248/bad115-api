import { ApiHideProperty } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class PaginatedDto<T> {
  @ApiHideProperty()
  readonly data: T[];

  readonly pagination: PaginationDto;
}
