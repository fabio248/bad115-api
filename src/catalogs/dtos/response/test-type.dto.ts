import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TestTypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
