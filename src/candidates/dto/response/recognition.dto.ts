import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { RecognitionTypesDto } from '../../../catalogs/dtos/response/recognition-types.dto';

@Exclude()
export class RecognitionDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly finishDate: Date;

  @Expose()
  readonly candidateId: string;

  @Expose()
  @Type(() => RecognitionTypesDto)
  readonly recognitionType?: RecognitionTypesDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
