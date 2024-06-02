import { PartialType } from '@nestjs/swagger';
import { CreateLanguageTypesDto } from './create-language-type.dto';
export class UpdateLanguageTypeDto extends PartialType(
  CreateLanguageTypesDto,
) {}
