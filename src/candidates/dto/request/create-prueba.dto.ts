import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { CreateTypeTestDto } from './create-type-test.dto';
import { Type } from 'class-transformer';

export class CreateTestDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  result: boolean;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  urlDocs: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @Type(() => CreateTypeTestDto)
  test: CreateTypeTestDto;
}
