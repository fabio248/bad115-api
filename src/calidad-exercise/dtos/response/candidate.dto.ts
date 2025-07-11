import { Exclude, Expose, Type } from 'class-transformer';
import { JobAplicationDto } from '../../../job-application/dto/response/job-aplication.dto';
import { PersonDto } from '../../../persons/dtos/response/person.dto';

@Exclude()
export class CandidateFilterByRangeDateDto {
  @Expose()
  readonly id: string;

  @Expose()
  @Type(() => PersonDto)
  readonly person: PersonDto;

  @Expose()
  @Type(() => JobAplicationDto)
  readonly jobApplications: JobAplicationDto[];
}
