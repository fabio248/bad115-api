import { IsOptional, IsPositive, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PageDto {
  /**
   * Set the page number to retrieve from
   */
  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  readonly page = 1;

  /**
   * Set how many items to retrieve per page
   */
  @ApiPropertyOptional({ type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Max(25)
  readonly perPage = 10;
}
