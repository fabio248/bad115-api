import { Expose } from 'class-transformer';
import { DocumentTypeEnum } from '../../enums/document-type.enum';

@Expose()
export class DocumentDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly type: DocumentTypeEnum;

  @Expose()
  readonly number: string;
}
