import { PaginationDto } from '../dtos/response/pagination.dto';
import { PageDto } from '../dtos/request/page.dto';

export function getPaginationInfo(
  { page, perPage }: PageDto,
  totalItems: number,
): PaginationDto {
  const totalPages = Math.ceil(totalItems / perPage);
  const nextPage = page < totalPages ? page + 1 : undefined;
  const previousPage = page > 1 && !(page > totalPages) ? page - 1 : undefined;
  return {
    totalPages,
    perPage,
    totalItems,
    page,
    nextPage,
    previousPage,
  };
}

export function getPaginationParams({ page, perPage }: PageDto): {
  take: number;
  skip: number;
} {
  const take = perPage;
  const skip = (page - 1) * perPage;

  return { take, skip };
}
