import { Exclude, Expose } from 'class-transformer';
import { DocumentTypeEnum } from '../../enums/document-type.enum';

@Exclude()
export class DocumentDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly type: DocumentTypeEnum;

  @Expose()
  readonly number: string;
}
