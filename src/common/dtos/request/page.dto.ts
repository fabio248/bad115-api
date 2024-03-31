import { IsOptional, IsPositive, Max } from 'class-validator';

export class PageDto {
  /**
   * Set the page number to retrieve from
   */
  @IsOptional()
  @IsPositive()
  readonly page = 1;

  /**
   * Set how many items to retrieve per page
   */
  @IsOptional()
  @IsPositive()
  @Max(25)
  readonly perPage = 10;
}
