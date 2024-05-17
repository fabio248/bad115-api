import { CreateRecognitionDto } from './create-recognition.dto';

import { PartialType } from '@nestjs/swagger';

export class UpdateRecognitionDto extends PartialType(CreateRecognitionDto) {}
