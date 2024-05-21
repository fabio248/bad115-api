import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ParticipationTypesDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
