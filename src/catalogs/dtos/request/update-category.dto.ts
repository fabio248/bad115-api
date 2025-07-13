import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from '../../../candidates/dto/request/create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
