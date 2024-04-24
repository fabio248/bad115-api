import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CertificationDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly organizationName: string;

  @Expose()
  readonly type: string;

  @Expose()
  readonly code: string;

  @Expose()
  readonly initDate: Date;

  @Expose()
  readonly finishDate: Date;
}
