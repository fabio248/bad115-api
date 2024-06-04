import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

@Exclude()
export class TestTypeDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}

@Exclude()
export class TestDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly result: boolean;

  /**
   * Cuando el endpoint de creación de test recibe un archivo, se retorna la url para subir el archivo,
   * de lo contrario es la url para visualizar el archivo
   * @example 'https://bucket.s3.region.amazonaws.com/folderName/key'
   */
  @Expose()
  readonly urlDocs?: string;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => TestTypeDto)
  readonly testType: TestTypeDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
