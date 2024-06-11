import { Expose, Type } from 'class-transformer';
import { CompanyDto } from '../../../companies/dtos/response/company.dto';
import { PersonDto } from 'src/persons/dtos/response/person.dto';

export class RecruiterDto {
  @Expose()
  readonly id: string;

  @Expose()
  @Type(() => CompanyDto)
  readonly companies: CompanyDto[];

  @Expose()
  @Type(() => PersonDto)
  readonly person: PersonDto;
}
