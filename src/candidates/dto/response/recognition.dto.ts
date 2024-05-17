import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateRecognitionTypeDto } from '../request/create-recognition-type.dto';
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
  @Type(() => CreateRecognitionTypeDto)
  readonly recognitionType?: CreateRecognitionTypeDto;

  @ApiHideProperty()
  readonly createdAt: Date;

  @ApiHideProperty()
  readonly updatedAt: Date;

  @ApiHideProperty()
  readonly deletedAt: Date;
}
