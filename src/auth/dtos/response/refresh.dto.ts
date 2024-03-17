import { Expose } from 'class-transformer';

export class RefreshDto {
  @Expose()
  refreshToken: string;
}
