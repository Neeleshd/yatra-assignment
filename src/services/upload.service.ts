import * as AWS from 'aws-sdk';
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

const AWS_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class UploadService {
  constructor() {}

  private async uploadFile(file: any, Key: string): Promise<any> {
    try {
      const params = {
        Key,
        Bucket: AWS_BUCKET_NAME,
        ContentType: file.mimetype,
        Body: file.buffer,
      };
      return await s3.upload(params).promise();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getObject(Key: string): Promise<any> {
    const params = { Key, Bucket: AWS_BUCKET_NAME };
    return s3.getObject(params).promise();
  }

  public async multipleFileUpload(files: any[]): Promise<any> {
    const key = 'images/';
    const promise = files.map(x => {
      this.uploadFile(x, key + uuid());
    });
    return Promise.all(promise);
  }
}
