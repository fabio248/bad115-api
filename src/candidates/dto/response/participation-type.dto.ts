import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ParticipationTypeDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;
}
