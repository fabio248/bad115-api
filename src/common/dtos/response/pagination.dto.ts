export class PaginationDto {
  /**
   * The total amount of pages (based on the limit)
   */
  readonly totalPages: number;
  /**
   * Current perPage value (passed as query param in the request)
   */
  readonly perPage: number;

  /**
   * The total amount of items in the database
   */
  readonly totalItems: number;

  /**
   * Current page value
   */
  readonly page: number;

  /**
   * Next page value. Null if there's not next page
   */
  readonly nextPage?: number;

  /**
   * Previous page value. Null if there's not previous page
   */
  readonly previousPage?: number;
}
