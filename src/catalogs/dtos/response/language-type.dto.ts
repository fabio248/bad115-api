import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LanguageTypesDto {
  @Expose()
  id: string;

  @Expose()
  language: string;
}
