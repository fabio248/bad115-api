import { IsIn, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { getSortOptions } from '../../../common/utils/sort.utils';
import { Person } from '@prisma/client';

export class CandidateFilterDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('VALIDATION.IS_STRING') })
  readonly search?: string;

  /*
   * Este campo es para ordenar los resultados, solamente cuando el campo search no está presente, en caso de que este presente se ordenarán por relevancia.
   */
  @IsIn(
    getSortOptions<Person>([
      'firstName',
      'lastName',
      'middleName',
      'secondLastName',
    ]),
  )
  @IsOptional()
  readonly sort?: string = 'firstName-asc';
}
