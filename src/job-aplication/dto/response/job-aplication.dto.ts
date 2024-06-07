import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { JobAplicationEnum } from 'src/job-aplication/enums/job-aplication.enum';

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
  readonly candidateId: string;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
