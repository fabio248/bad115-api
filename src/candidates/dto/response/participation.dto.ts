import { Exclude, Expose, Type } from 'class-transformer';
import { ParticipationTypeDto } from './participation-type.dto';

@Exclude()
export class ParticipationDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly date: Date;

  @Expose()
  readonly place: string;

  @Expose()
  readonly country: string;

  @Expose()
  readonly eventHost: string;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => ParticipationTypeDto)
  readonly participationType?: ParticipationTypeDto;
}
