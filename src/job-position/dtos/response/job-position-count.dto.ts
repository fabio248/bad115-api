import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JobPositionCountDto {
  @Expose()
  readonly countActive: number;

  @Expose()
  readonly countInactive: number;
}
