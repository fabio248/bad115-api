import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IFileUpload } from '../interfaces';

@Injectable()
export class FilesService {
  private readonly s3Client: S3;
  private readonly region = this.configService.get('app.aws.region');
  private readonly accessKeyId = this.configService.get<string>('app.aws.key');
  private readonly secretKey = this.configService.get('app.aws.secret');
  private readonly bucketName = this.configService.get('app.aws.bucket');
  private readonly EXPIRE_15MIN = 900;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretKey,
      },
      region: this.region,
    });
  }

  async getSignedUrlForFileUpload({
    key,
    folderName,
    mimeType,
  }: IFileUpload): Promise<string> {
    const path = folderName ? `${folderName}/${key}` : key;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      ContentType: mimeType,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.EXPIRE_15MIN,
    });
  }

  async getSignedUrlForFileRetrieval(keyNameFile: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: keyNameFile,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.EXPIRE_15MIN,
    });
  }
}
