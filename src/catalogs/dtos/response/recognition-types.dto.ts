import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RecognitionTypesDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
