import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RecognitionTypesDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
