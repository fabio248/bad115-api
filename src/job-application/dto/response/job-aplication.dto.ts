import { Exclude, Expose, Type } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { JobAplicationEnum } from 'src/job-application/enums/job-aplication.enum';
import { CandidateDto } from '../../../candidates/dto/response/candidate.dto';
import { JobPositionDto } from '../../../job-position/dtos/response/job-position.dto';

@Exclude()
export class MeetingsDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly executionDate: Date;

  @Expose()
  readonly link: string;

  @Expose()
  readonly jobAplicationId: string;
}

@Exclude()
export class JobAplicationDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly status: JobAplicationEnum;

  @Expose()
  readonly recomendation?: string;
  /**
   * Cuando el endpoint de creación de test recibe un archivo, se retorna la url para subir el archivo,
   * de lo contrario es la url para visualizar el archivo
   * @example 'https://bucket.s3.region.amazonaws.com/folderName/key'
   */
  @Expose()
  readonly cv?: string;

  @Expose()
  readonly jobPositionId: string;

  @Expose()
  @Type(() => CandidateDto)
  readonly candidate?: CandidateDto;

  @Expose()
  @Type(() => MeetingsDto)
  readonly meeting?: MeetingsDto[];

  @Expose()
  @Type(() => JobPositionDto)
  readonly jobPosition?: JobPositionDto;

  @Expose()
  readonly percentage?: string;

  @Expose()
  readonly candidateId: string;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
