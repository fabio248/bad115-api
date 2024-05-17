import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRecognitionTypeDto } from './create-recognition-type.dto';
import { Type } from 'class-transformer';

export class CreateRecognitionDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly finishDate: Date;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @Type(() => CreateRecognitionTypeDto)
  readonly recognitionType?: CreateRecognitionTypeDto;
}
