import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PublicationDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly place: string;

  @Expose()
  readonly type: string;

  @Expose()
  readonly candidateId: string;

  //estos dos campos solo se enviando si el type = "libro"
  @Expose()
  readonly edition?: string;

  @Expose()
  readonly isbn?: string;
}
